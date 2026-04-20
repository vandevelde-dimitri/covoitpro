import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRepositories } from "../useRepositories";

export const useChatMessages = (conversationId: string, userId: string) => {
  const queryClient = useQueryClient();
  const { chatRepository, chatSubscriptionRepository } = useRepositories();

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

  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = chatSubscriptionRepository.subscribeToChatMessages(
      conversationId,
      userId,
      (newMessage) => {
        const currentData = queryClient.getQueryData([
          "messages",
          conversationId,
        ]) as any;

        const alreadyExists = currentData?.pages?.some((page: any) =>
          page.some((m: any) => m.id === newMessage.id),
        );

        if (alreadyExists) return;

        queryClient.setQueryData(
          ["messages", conversationId],
          (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: [
                [newMessage, ...oldData.pages[0]],
                ...oldData.pages.slice(1),
              ],
            };
          },
        );
      },
      (error) => {
        if (__DEV__)
          console.error("[useChatMessages] Subscription error:", error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [conversationId, userId, chatSubscriptionRepository, queryClient]);

  return query;
};
