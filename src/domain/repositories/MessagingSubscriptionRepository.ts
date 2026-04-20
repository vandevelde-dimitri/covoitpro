/**
 * Interface pour gérer les subscriptions aux messages
 * Isoler les détails techniques de Realtime Supabase
 */
export interface IMessagingSubscriptionRepository {
  /**
   * Récupère les conversations non lues
   */
  getUnreadConversations(userId: string): Promise<string[]>;

  /**
   * S'abonne aux changements de messages
   */
  subscribeToMessages(
    userId: string,
    activeConversationId: string | null,
    onNewMessage: (conversationId: string) => void,
    onError: (error: Error) => void,
    onStatusChange: (
      status: "SUBSCRIBED" | "CHANNEL_ERROR" | "LOADING",
    ) => void,
  ): () => void;
}
