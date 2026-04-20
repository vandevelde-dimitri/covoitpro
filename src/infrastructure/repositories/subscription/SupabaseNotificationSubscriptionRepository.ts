import { INotificationSubscriptionRepository } from "@/src/domain/repositories/NotificationSubscriptionRepository";
import { supabase } from "../../supabase";

export class SupabaseNotificationSubscriptionRepository implements INotificationSubscriptionRepository {
  private static instance: SupabaseNotificationSubscriptionRepository;

  private constructor() {}

  static getInstance(): SupabaseNotificationSubscriptionRepository {
    if (!SupabaseNotificationSubscriptionRepository.instance) {
      SupabaseNotificationSubscriptionRepository.instance =
        new SupabaseNotificationSubscriptionRepository();
    }
    return SupabaseNotificationSubscriptionRepository.instance;
  }

  async getUnreadNotificationCount(): Promise<number> {
    const { data, error } = await supabase.rpc("get_unread_notification_count");

    if (error) {
      if (__DEV__)
        console.error("[NotificationSubscription] RPC error:", error.message);
      throw new Error(error.message);
    }

    return data ?? 0;
  }

  subscribeToNotifications(
    userId: string,
    onNotificationChange: (count: number) => void,
    onError?: (error: Error) => void,
  ): () => void {
    const channel = supabase
      .channel(`user-notifications-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "participant_requests" },
        async (payload) => {
          const { owner_id } = payload.new as { owner_id: string };

          if (owner_id === userId) {
            try {
              const count = await this.getUnreadNotificationCount();
              onNotificationChange(count);
            } catch (error) {
              if (__DEV__)
                console.error("[NotificationSubscription] Error:", error);
              if (onError) onError(error as Error);
            }
          }
        },
      )
      .on("error", (error) => {
        if (__DEV__)
          console.error("[NotificationSubscription] Channel error:", error);
        if (onError) onError(new Error(error.message));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}
