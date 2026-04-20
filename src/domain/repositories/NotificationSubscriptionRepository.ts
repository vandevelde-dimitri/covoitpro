/**
 * Interface pour gérer les subscriptions aux notifications
 * Isoler les détails techniques de Realtime Supabase
 */
export interface INotificationSubscriptionRepository {
  /**
   * Récupère le nombre de notifications non lues
   */
  getUnreadNotificationCount(): Promise<number>;

  /**
   * S'abonne aux changements de notifications
   */
  subscribeToNotifications(
    userId: string,
    onNotificationChange: (count: number) => void,
    onError?: (error: Error) => void,
  ): () => void;
}
