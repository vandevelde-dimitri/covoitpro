import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { DeleteAvatarUseCase } from "../../../application/use-case/user/DeleteAvatar";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  const useCase = useMemo(() => {
    const userRepo = SupabaseUserRepository.getInstance();
    return new DeleteAvatarUseCase(userRepo);
  }, []);

  return useMutation({
    mutationFn: () => useCase.execute(),
    onError: () => {
      toast.show(<CustomToast title="Erreur" message="Suppression échouée" />, {
        type: "error",
      });
    },
    onSuccess: () => {
      toast.show(<CustomToast title="Succès" message="Suppression réussie" />, {
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
};
