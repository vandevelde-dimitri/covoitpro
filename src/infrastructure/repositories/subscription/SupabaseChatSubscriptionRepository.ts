import { IChatSubscriptionRepository } from "@/src/domain/repositories/ChatSubscriptionRepository";
import {
  MessageDto,
  MessageMapper,
} from "@/src/infrastructure/mappers/MessageMapper";
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
  ): () => void {
    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          try {
            const newMessage = payload.new as MessageDto;

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
      .on("error", (error) => {
        if (__DEV__) console.error("[ChatSubscription] Channel error:", error);
        if (onError) onError(new Error(error.message));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}
