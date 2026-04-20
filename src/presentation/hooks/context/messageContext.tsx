import { logger } from "@/utils/logger";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "../authContext";
import { useRepositories } from "../useRepositories";

type MessageContextType = {
  unreadCount: number;
  unreadConversations: Record<string, boolean>;
  markConversationRead: (conversationId: string) => Promise<void>;
  setActiveConversation: (conversationId: string | null) => void;
  connectionStatus: "SUBSCRIBED" | "CHANNEL_ERROR" | "LOADING";
};

const MessageContext = createContext<MessageContextType>({
  unreadCount: 0,
  unreadConversations: {},
  markConversationRead: async () => {},
  setActiveConversation: () => {},
  connectionStatus: "LOADING",
});

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session } = useAuth();
  const userId = session?.user.id;
  const queryClient = useQueryClient();
  const { messagingSubscriptionRepository, messagingRepository } =
    useRepositories();

  const [unreadConversations, setUnreadConversations] = useState<
    Record<string, boolean>
  >({});
  const [connectionStatus, setConnectionStatus] = useState<
    "SUBSCRIBED" | "CHANNEL_ERROR" | "LOADING"
  >("LOADING");

  const activeConversationRef = useRef<string | null>(null);

  const setActiveConversation = useCallback((conversationId: string | null) => {
    activeConversationRef.current = conversationId;
  }, []);

  const loadUnreadConversations = async () => {
    if (!userId) return;
    try {
      const conversationIds =
        await messagingSubscriptionRepository.getUnreadConversations(userId);
      const map: Record<string, boolean> = {};
      conversationIds.forEach((id) => {
        map[id] = true;
      });
      setUnreadConversations(map);
    } catch (error) {
      await logger.critical(
        "ERR_CTX_MESS",
        "getUnreadConversations",
        error,
        userId,
      );
    }
  };

  useEffect(() => {
    if (!userId) return;
    loadUnreadConversations();

    const unsubscribe = messagingSubscriptionRepository.subscribeToMessages(
      userId,
      activeConversationRef.current,
      (conversationId) => {
        setUnreadConversations((prev) => ({
          ...prev,
          [conversationId]: true,
        }));
        queryClient.invalidateQueries({
          queryKey: ["user-conversations", userId],
        });
      },
      (error) => {
        if (__DEV__)
          console.error("[MessageContext] Subscription error:", error);
      },
      (status) => {
        setConnectionStatus(status);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [
    userId,
    messagingSubscriptionRepository,
    messagingRepository,
    queryClient,
  ]);

  const markConversationRead = async (conversationId: string) => {
    if (!userId) return;
    try {
      await messagingRepository.markConversationRead(conversationId, userId);
      setUnreadConversations((prev) => {
        const copy = { ...prev };
        delete copy[conversationId];
        return copy;
      });
    } catch (error) {
      if (__DEV__)
        console.error(
          "[MessageContext] Error marking conversation as read:",
          error,
        );
    }
  };

  return (
    <MessageContext.Provider
      value={{
        unreadCount: Object.keys(unreadConversations).length,
        unreadConversations,
        markConversationRead,
        setActiveConversation,
        connectionStatus,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageStatus = () => useContext(MessageContext);
