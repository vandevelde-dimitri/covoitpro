import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { DeleteAccountUseCase } from "../../../application/use-case/user/DeleteAccount";
import { CustomToast } from "../../components/ui/CustomToast";
import { useToast } from "../../components/ui/molecules/Toast";

import { useAuth } from "../authContext";

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { logout } = useAuth();
  const useCase = useMemo(() => {
    const userRepo = SupabaseUserRepository.getInstance();
    return new DeleteAccountUseCase(userRepo);
  }, []);

  return useMutation({
    mutationFn: () => useCase.execute(),
    onSuccess: async () => {
      queryClient.clear();

      await logout();

      toast.show(<CustomToast title="Succès" message="Suppression réussie" />, {
        type: "success",
      });
    },
    onError: (error) => {
      if (__DEV__) console.error("Erreur suppression compte:", error);
      toast.show(<CustomToast title="Erreur" message="Suppression échouée" />, {
        type: "error",
      });
    },
  });
};
