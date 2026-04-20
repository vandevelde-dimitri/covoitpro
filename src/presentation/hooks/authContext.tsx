import { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { getIsRecoveryFlow } from "./deepLinkFlag";
import { useUserProfileStatus } from "./queries/useUserProfileStatus";
import { useRepositories } from "./useRepositories";

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  profileCompleted: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
  checkProfileStatus: () => Promise<void>;
  setProfileCompleted: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  profileCompleted: false,
  refreshSession: async () => {},
  logout: async () => {},
  checkProfileStatus: async () => {},
  setProfileCompleted: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [shouldCheckProfile, setShouldCheckProfile] = useState(false);
  const queryClient = useQueryClient();
  const { sessionRepository } = useRepositories();

  const { data: profileStatus, isLoading: profileLoading } =
    useUserProfileStatus(shouldCheckProfile);

  useEffect(() => {
    if (shouldCheckProfile && !profileLoading) {
      if (profileStatus !== undefined) {
        if (profileCompleted && profileStatus === false) {
          if (__DEV__)
            console.log(
              "[Auth] Profil déjà complété manuellement, on ignore le statut serveur 'false'.",
            );
        } else {
          setProfileCompleted(profileStatus);
        }
      }
      setLoading(false);
      setShouldCheckProfile(false);
    }
  }, [profileStatus, profileLoading, shouldCheckProfile, profileCompleted]);
  const checkProfileStatus = async () => {
    setLoading(true);
    if (__DEV__) console.log(" [Auth] Checking profile status...");
    try {
      const session = await sessionRepository.getSession();

      if (!session) {
        setProfileCompleted(false);
        setLoading(false);
        return;
      }

      setShouldCheckProfile(true);
    } catch (error) {
      if (__DEV__) console.error("❌ [Auth] Profile check error:", error);
      setProfileCompleted(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let initTimeoutId: ReturnType<typeof setTimeout>;

    const initializeAuth = async () => {
      try {
        const restoredSession = await sessionRepository.getSession();

        if (isMounted) {
          if (restoredSession) {
            setSession(restoredSession);
            checkProfileStatus();
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        if (__DEV__) console.error("Auth initialization error:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    initTimeoutId = setTimeout(() => {
      if (isMounted) {
        if (__DEV__)
          console.warn("Auth initialization timeout - forcing completion");
        setLoading(false);
      }
    }, 3000);

    const unsubscribeSession = sessionRepository.onSessionChange(
      async (event, session) => {
        if (!isMounted) return;

        setSession(session);
        if (event === "USER_UPDATED") {
          if (__DEV__) console.log("[Auth] User updated event detected");
          // On force la mise à jour de la session pour récupérer le nouvel email
          console.log("session: ", session);

          setSession(session);
        }

        const inRecoveryFlow = getIsRecoveryFlow();

        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          if (inRecoveryFlow) {
            if (__DEV__)
              console.log(
                "[Auth] Recovery flow detected - skipping profile check",
              );
            setLoading(false);
          } else {
            await checkProfileStatus();
          }
        } else if (event === "SIGNED_OUT") {
          setProfileCompleted(false);
          setLoading(false);
        }

        clearTimeout(initTimeoutId);
      },
    );

    const subscriptionAppState = AppState.addEventListener(
      "change",
      (state) => {
        // Note: startAutoRefresh/stopAutoRefresh pourraient être ajoutés à ISessionRepository
        // Pour l'instant, on peut laisser cette logique ou la déplacer plus tard
      },
    );

    return () => {
      isMounted = false;
      clearTimeout(initTimeoutId);
      unsubscribeSession();
      subscriptionAppState.remove();
    };
  }, [sessionRepository]);

  const refreshSession = async () => {
    try {
      await sessionRepository.refreshSession();
      const updatedSession = await sessionRepository.getSession();
      if (updatedSession) {
        setSession(updatedSession);
        await checkProfileStatus();
      }
    } catch (error) {
      if (__DEV__) console.error("Refresh session error:", error);
    }
  };

  const logout = async () => {
    try {
      await sessionRepository.logout();

      queryClient.clear();

      setSession(null);
      setProfileCompleted(false);

      if (__DEV__) console.log("[Auth] Logout: Session and Cache cleared");
    } catch (error) {
      if (__DEV__) console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        profileCompleted,
        refreshSession,
        logout,
        checkProfileStatus,
        setProfileCompleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
