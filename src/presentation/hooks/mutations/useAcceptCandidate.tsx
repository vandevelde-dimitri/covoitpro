import { AcceptCandidateUseCase } from "@/src/application/use-case/notification/AcceptCandidate";
import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/auth/SupabaseAuthRepository";
import { SupabaseAnnouncementRepository } from "@/src/infrastructure/repositories/SupabaseAnnouncementRepository";
import { SupabaseParticipantRepository } from "@/src/infrastructure/repositories/SupabaseParticipantRepository";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export const useAcceptCandidate = () => {
  const queryClient = useQueryClient();

  const useCase = useMemo(() => {
    const participantRepo = SupabaseParticipantRepository.getInstance();
    const announcementRepo = SupabaseAnnouncementRepository.getInstance();
    const authRepo = SupabaseAuthRepository.getInstance();
    return new AcceptCandidateUseCase(
      participantRepo,
      announcementRepo,
      authRepo,
    );
  }, []);

  return useMutation({
    mutationFn: ({
      candidateId,
      annonceId,
    }: {
      candidateId: string;
      annonceId: string;
    }) => useCase.execute(candidateId, annonceId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", "combined"],
      });
      queryClient.invalidateQueries({
        queryKey: ["announcements", variables.annonceId],
      });
      queryClient.invalidateQueries({ queryKey: ["announcements", "owner"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({
        queryKey: ["apply", variables.annonceId, variables.candidateId],
      });
    },
  });
};
