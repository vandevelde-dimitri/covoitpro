export interface IChatSubscriptionRepository {
  /**
   * S'abonne aux nouveaux messages d'une conversation
   */
  subscribeToChatMessages(
    conversationId: string,
    userId: string,
    onNewMessage: (message: any) => void,
    onError?: (error: Error) => void,
    onStatusChange?: (
      status: "SUBSCRIBED" | "CHANNEL_ERROR" | "LOADING",
    ) => void,
  ): () => void;
}
