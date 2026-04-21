import { IMessagingSubscriptionRepository } from "@/src/domain/repositories/MessagingSubscriptionRepository";
import { logger } from "@/utils/logger";
import { supabase } from "../../supabase";

export class SupabaseMessagingSubscriptionRepository implements IMessagingSubscriptionRepository {
  private static instance: SupabaseMessagingSubscriptionRepository;

  private constructor() {}

  static getInstance(): SupabaseMessagingSubscriptionRepository {
    if (!SupabaseMessagingSubscriptionRepository.instance) {
      SupabaseMessagingSubscriptionRepository.instance =
        new SupabaseMessagingSubscriptionRepository();
    }
    return SupabaseMessagingSubscriptionRepository.instance;
  }

  async getUnreadConversations(userId: string): Promise<string[]> {
    const { data, error } = await supabase.rpc("get_unread_conversations", {
      p_user_id: userId,
    });

    if (error) {
      await logger.critical(
        "ERR_REPO_MESS_SUB",
        "get_unread_conversations",
        error,
        userId,
      );
      throw new Error(error.message);
    }

    return (
      data?.map((row: { conversation_id: string }) => row.conversation_id) ?? []
    );
  }

  subscribeToMessages(
    userId: string,
    activeConversationId: string | null,
    onNewMessage: (conversationId: string) => void,
    onError: (error: Error) => void,
    onStatusChange: (
      status: "SUBSCRIBED" | "CHANNEL_ERROR" | "LOADING",
    ) => void,
  ): () => void {
    onStatusChange("LOADING");
    let channel = supabase.channel("messages-global");
    let retryCount = 0;
    const maxRetries = 3;

    let retryTimeout: ReturnType<typeof setTimeout> | null = null;
    let isCancelled = false;

    const subscribe = () => {
      if (isCancelled) return;

      channel = supabase
        .channel("messages-global")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            const msg = payload.new as {
              sender_id: string;
              conversation_id: string;
            };

            if (
              msg.sender_id === userId ||
              msg.conversation_id === activeConversationId
            )
              return;

            onNewMessage(msg.conversation_id);
          },
        )
        .subscribe((status) => {
          if (isCancelled) return;

          if (status === "SUBSCRIBED") {
            if (__DEV__) console.log("[MessagingSubscription] Subscribed");
            retryCount = 0;
            onStatusChange("SUBSCRIBED");
          } else if (status === "CHANNEL_ERROR") {
            if (__DEV__) console.error("[MessagingSubscription] Channel error");
            onStatusChange("CHANNEL_ERROR");
            onError(new Error("Channel error"));

            if (retryCount < maxRetries) {
              retryCount++;
              const delay = Math.pow(2, retryCount) * 1000;
              retryTimeout = setTimeout(() => subscribe(), delay);
            }
          }
        });
    };

    subscribe();

    return () => {
      isCancelled = true;
      if (retryTimeout) clearTimeout(retryTimeout);
      supabase.removeChannel(channel);
    };
  }
}
