import { SendMessage } from "@/src/application/use-case/chat/SendMessage";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/SupabaseChatRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useSendMessage = (conversationId: string, userId: string) => {
  const queryClient = useQueryClient();

  const sendMessageUseCase = useMemo(() => {
    const chatRepo = SupabaseChatRepository.getInstance();
    return new SendMessage(chatRepo);
  }, []);

  return useMutation({
    mutationFn: ({ content }: { content: string }) =>
      sendMessageUseCase.execute(conversationId, content),

    onError: (error) => {
      if (__DEV__) console.error("Erreur lors de l'envoi du message :", error);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["conversations", userId],
      });
    },
  });
};
