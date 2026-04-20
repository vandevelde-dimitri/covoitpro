import { UnauthorizedError } from "@/src/domain/errors/AppError";
import { IAnnouncementRepository } from "@/src/domain/repositories/AnnouncementRepository";
import { IParticipantRepository } from "@/src/domain/repositories/ParticipantRepository";
import { IAuthRepository } from "@/src/domain/repositories/auth/AuthRepository";

export class AcceptCandidateUseCase {
  constructor(
    private participantRepo: IParticipantRepository,
    private announcementRepo: IAnnouncementRepository,
    private authRepo: IAuthRepository,
  ) {}

  async execute(candidateId: string, announcementId: string): Promise<void> {
    const userId = await this.authRepo.getCurrentUserId();

    const announcement =
      await this.announcementRepo.getAnnouncementById(announcementId);
    if (!announcement) throw new Error("Annonce non trouvée");

    if (announcement.owner.id !== userId) {
      throw new UnauthorizedError(
        "Seul le propriétaire peut accepter les candidatures",
      );
    }

    await this.participantRepo.acceptCandidate(candidateId, announcementId);
  }
}
