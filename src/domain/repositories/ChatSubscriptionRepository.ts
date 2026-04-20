/**
 * Interface pour gérer les subscriptions aux messages de chat
 */
export interface IChatSubscriptionRepository {
  /**
   * S'abonne aux nouveaux messages d'une conversation
   */
  subscribeToChatMessages(
    conversationId: string,
    userId: string,
    onNewMessage: (message: any) => void,
    onError?: (error: Error) => void,
  ): () => void;
}
