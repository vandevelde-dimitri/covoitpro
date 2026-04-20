import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../authContext";
import { useRepositories } from "../useRepositories";

type NotificationContextType = {
  notificationCount: number;
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
  hasNewNotification: boolean;
};

const NotificationContext = createContext<NotificationContextType>({
  notificationCount: 0,
  setNotificationCount: () => {},
  hasNewNotification: false,
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();
  const { notificationSubscriptionRepository } = useRepositories();
  const [notificationCount, setNotificationCount] = useState(0);

  const hasNewNotification = notificationCount > 0;

  useEffect(() => {
    if (!userId) return;

    const fetchCount = async () => {
      try {
        const count =
          await notificationSubscriptionRepository.getUnreadNotificationCount();
        setNotificationCount(count);
      } catch (error) {
        if (__DEV__)
          console.error("[NotificationContext] Error fetching count:", error);
      }
    };
    fetchCount();

    const unsubscribe =
      notificationSubscriptionRepository.subscribeToNotifications(
        userId,
        (count) => {
          setNotificationCount(count);
          queryClient.invalidateQueries({
            queryKey: ["notifications", "combined"],
          });
        },
        (error) => {
          if (__DEV__)
            console.error("[NotificationContext] Subscription error:", error);
        },
      );

    return () => {
      unsubscribe();
    };
  }, [userId, notificationSubscriptionRepository, queryClient]);

  return (
    <NotificationContext.Provider
      value={{
        notificationCount,
        setNotificationCount,
        hasNewNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationStatus = () => useContext(NotificationContext);
