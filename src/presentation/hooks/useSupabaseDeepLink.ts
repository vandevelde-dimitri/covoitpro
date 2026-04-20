import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { setRecoveryFlow } from "./deepLinkFlag";
import { useRepositories } from "./useRepositories";

export const useSupabaseDeepLink = () => {
  const url = Linking.useURL();
  const router = useRouter();
  const hasProcessed = useRef(false);
  const { sessionRepository } = useRepositories();

  useEffect(() => {
    (async () => {
      try {
        const rawUrl = url;

        if (
          !rawUrl?.includes("type=recovery") &&
          !rawUrl?.includes("reset-password")
        )
          return;

        if (hasProcessed.current) {
          if (__DEV__)
            console.log("[DeepLink] Déjà traité, ignoring duplicate URL");
          return;
        }

        if (__DEV__) console.log("🔗 Analyse du Deep Link...");

        const hashIndex = rawUrl.indexOf("#");
        if (hashIndex === -1) {
          if (__DEV__) console.log("[DeepLink] Pas de hash trouvé");
          return;
        }

        const hashFragment = rawUrl.substring(hashIndex + 1);
        const params = new URLSearchParams(hashFragment);

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        if (__DEV__) {
          console.log("[DeepLink] accessToken:", accessToken ? "✓" : "✗");
          console.log("[DeepLink] type:", type);
        }

        if (accessToken && type === "recovery") {
          hasProcessed.current = true;

          if (__DEV__)
            console.log("🔑 Tokens trouvés ! Synchronisation Supabase...");

          setRecoveryFlow(true);
          if (__DEV__) console.log("[DeepLink] Recovery flow flagged");

          try {
            await sessionRepository.setSession(accessToken, refreshToken || "");
            if (__DEV__) console.log("[DeepLink] setSession: ✅ OK");
          } catch (error: any) {
            if (__DEV__)
              console.error("[DeepLink] setSession error:", error.message);
          }

          if (__DEV__) console.log("→ Navigation vers /(auth)/reset-password");

          router.replace("/(auth)/reset-password");
        } else {
          if (__DEV__)
            console.log("[DeepLink] Pas de tokens ou type incorrect", {
              accessToken: !!accessToken,
              type,
            });
        }
      } catch (err: any) {
        if (__DEV__) console.error("[DeepLink] Erreur globale:", err.message);
      }
    })();
  }, [url, router, setRecoveryFlow]);

  return {};
};
