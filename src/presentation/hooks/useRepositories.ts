/**
 * Hook centralisé pour accéder à toutes les implémentations de repositories.
 *
 * C'est LE SEUL endroit où les implémentations Supabase doivent être importées
 * directement. Tous les autres fichiers doivent utiliser les interfaces.
 *
 * Cela permet de changer le backend sans impacter le reste de l'app.
 */

import { SupabaseAuthRepository } from "@/src/infrastructure/repositories/auth/SupabaseAuthRepository";
import { SupabaseSessionRepository } from "@/src/infrastructure/repositories/session/SupabaseSessionRepository";
import { SupabaseChatSubscriptionRepository } from "@/src/infrastructure/repositories/subscription/SupabaseChatSubscriptionRepository";
import { SupabaseMessagingSubscriptionRepository } from "@/src/infrastructure/repositories/subscription/SupabaseMessagingSubscriptionRepository";
import { SupabaseNotificationSubscriptionRepository } from "@/src/infrastructure/repositories/subscription/SupabaseNotificationSubscriptionRepository";
import { SupabaseAnnouncementRepository } from "@/src/infrastructure/repositories/SupabaseAnnouncementRepository";
import { SupabaseChatRepository } from "@/src/infrastructure/repositories/SupabaseChatRepository";
import { SupabaseContactRepository } from "@/src/infrastructure/repositories/SupabaseContactRepository";
import { SupabaseFavoriteRepository } from "@/src/infrastructure/repositories/SupabaseFavoriteRepository";
import { SupabaseMessagingRepository } from "@/src/infrastructure/repositories/SupabaseMessagingRepository";
import { SupabaseNotificationRepository } from "@/src/infrastructure/repositories/SupabaseNotificationRepository";
import { SupabaseParticipantRepository } from "@/src/infrastructure/repositories/SupabaseParticipantRepository";
import { SupabaseSettingsRepository } from "@/src/infrastructure/repositories/SupabaseSettingRepository";
import { SupabaseUserRepository } from "@/src/infrastructure/repositories/SupabaseUserRepository";
import { useMemo } from "react";

export const useRepositories = () => {
  return useMemo(
    () => ({
      // Auth & Session
      authRepository: SupabaseAuthRepository.getInstance(),
      sessionRepository: SupabaseSessionRepository.getInstance(),

      // User
      userRepository: SupabaseUserRepository.getInstance(),
      contactRepository: SupabaseContactRepository.getInstance(),

      // Announcements & Messaging
      announcementRepository: SupabaseAnnouncementRepository.getInstance(),
      messagingRepository: SupabaseMessagingRepository.getInstance(),
      participantRepository: SupabaseParticipantRepository.getInstance(),
      chatRepository: SupabaseChatRepository.getInstance(),

      // Subscriptions
      messagingSubscriptionRepository:
        SupabaseMessagingSubscriptionRepository.getInstance(),
      notificationSubscriptionRepository:
        SupabaseNotificationSubscriptionRepository.getInstance(),
      chatSubscriptionRepository:
        SupabaseChatSubscriptionRepository.getInstance(),

      // Other
      favoriteRepository: SupabaseFavoriteRepository.getInstance(),
      notificationRepository: SupabaseNotificationRepository.getInstance(),
      settingRepository: SupabaseSettingsRepository.getInstance(),
    }),
    [],
  );
};

export type RepositoriesType = ReturnType<typeof useRepositories>;
