import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRepositories } from "../useRepositories";

export const useChatMessages = (conversationId: string, userId: string) => {
  const queryClient = useQueryClient();
  const { chatRepository, chatSubscriptionRepository } = useRepositories();
  const [connectionStatus, setConnectionStatus] = useState<
    "SUBSCRIBED" | "CHANNEL_ERROR" | "LOADING"
  >("LOADING");
  const prevConversationIdRef = useRef<string | null>(null);

  const query = useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: ({ pageParam = 0 }) =>
      chatRepository.getMessages(
        conversationId,
        pageParam as number,
        20,
        userId,
      ),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length : undefined,
    initialPageParam: 0,
  });

  // Refetch seulement quand on change de conversation
  useEffect(() => {
    if (conversationId !== prevConversationIdRef.current) {
      prevConversationIdRef.current = conversationId;
      query.refetch();
    }
  }, [conversationId]);

  const handleNewMessage = useCallback(
    (newMessage: any) => {
      const currentData = queryClient.getQueryData([
        "messages",
        conversationId,
      ]) as any;

      const alreadyExists = currentData?.pages?.some((page: any) =>
        page.some((m: any) => m.id === newMessage.id),
      );

      if (alreadyExists) return;

      queryClient.setQueryData(["messages", conversationId], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: [[newMessage, ...oldData.pages[0]], ...oldData.pages.slice(1)],
        };
      });
    },
    [conversationId, queryClient],
  );

  const handleNewMessageRef = useRef(handleNewMessage);
  useEffect(() => {
    handleNewMessageRef.current = handleNewMessage;
  }, [handleNewMessage]);

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = chatSubscriptionRepository.subscribeToChatMessages(
      conversationId,
      userId,
      (msg) => handleNewMessageRef.current(msg),
      (error) => {
        if (__DEV__)
          console.error("[useChatMessages] Subscription error:", error);
      },
      (status) => setConnectionStatus(status),
    );

    return () => {
      unsubscribe();
    };
  }, [conversationId, userId, chatSubscriptionRepository]);

  return {
    ...query,
    connectionStatus,
  };
};
