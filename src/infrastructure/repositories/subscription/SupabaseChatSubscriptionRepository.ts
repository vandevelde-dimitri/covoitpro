import { IChatSubscriptionRepository } from "@/src/domain/repositories/ChatSubscriptionRepository";
import { MessageMapper } from "@/src/infrastructure/mappers/MessageMapper";
import { supabase } from "../../supabase";

export class SupabaseChatSubscriptionRepository implements IChatSubscriptionRepository {
  private static instance: SupabaseChatSubscriptionRepository;

  private constructor() {}

  static getInstance(): SupabaseChatSubscriptionRepository {
    if (!SupabaseChatSubscriptionRepository.instance) {
      SupabaseChatSubscriptionRepository.instance =
        new SupabaseChatSubscriptionRepository();
    }
    return SupabaseChatSubscriptionRepository.instance;
  }

  subscribeToChatMessages(
    conversationId: string,
    userId: string,
    onNewMessage: (message: any) => void,
    onError?: (error: Error) => void,
    onStatusChange?: (
      status: "SUBSCRIBED" | "CHANNEL_ERROR" | "LOADING",
    ) => void,
  ): () => void {
    onStatusChange?.("LOADING");
    let channel: any = null;
    let retryCount = 0;
    const maxRetries = 3;
    let statusTimeout: NodeJS.Timeout | null = null;

    const subscribe = () => {
      // Nettoyer l'ancien channel si nécessaire
      if (channel) {
        supabase.removeChannel(channel);
      }

      channel = supabase
        .channel(`chat:${conversationId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${conversationId}`,
          },
          async (payload: any) => {
            try {
              const newMessage = payload.new as any;

              // Récupérer les données utilisateur pour mapper le message
              const { data: userData, error: userError } = await supabase
                .from("users")
                .select(
                  "id, firstname, lastname, image_profile, avatar_updated_at, contract",
                )
                .eq("id", newMessage.sender_id)
                .single();

              if (userError) {
                if (__DEV__)
                  console.error(
                    "[ChatSubscription] User fetch error:",
                    userError,
                  );
                if (onError) onError(new Error(userError.message));
                return;
              }

              const mappedMessage = MessageMapper.toDomain(
                { ...newMessage, users: userData },
                userId,
              );

              onNewMessage(mappedMessage);
            } catch (error) {
              if (__DEV__)
                console.error(
                  "[ChatSubscription] Error processing message:",
                  error,
                );
              if (onError) onError(error as Error);
            }
          },
        )
        .subscribe((status) => {
          if (__DEV__)
            console.log(
              `[ChatSubscription] Subscribe status: ${status} for conversation ${conversationId}`,
            );

          if (status === "SUBSCRIBED") {
            retryCount = 0;
            if (statusTimeout) clearTimeout(statusTimeout);
            onStatusChange?.("SUBSCRIBED");
          } else if (status === "CHANNEL_ERROR") {
            onStatusChange?.("CHANNEL_ERROR");
            if (retryCount < maxRetries) {
              retryCount++;
              const delay = Math.pow(2, retryCount) * 1000;
              if (__DEV__)
                console.log(
                  `[ChatSubscription] Retrying in ${delay}ms (attempt ${retryCount}/${maxRetries})`,
                );
              statusTimeout = setTimeout(() => subscribe(), delay);
            }
          }
        });
    };

    subscribe();

    return () => {
      if (statusTimeout) clearTimeout(statusTimeout);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }
}
