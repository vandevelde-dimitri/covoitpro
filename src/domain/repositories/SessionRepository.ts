import { Session } from "@supabase/supabase-js";

export interface ISessionRepository {
  /**
   * Récupère la session actuelle
   */
  getSession(): Promise<Session | null>;

  /**
   * Actualise la session
   */
  refreshSession(): Promise<void>;

  /**
   * Déconnecte l'utilisateur
   */
  logout(): Promise<void>;

  /**
   * Définit une session avec les tokens fournis
   */
  setSession(accessToken: string, refreshToken: string): Promise<void>;

  /**
   * Écoute les changements de session avec les événements
   */
  onSessionChange(
    callback: (event: string, session: Session | null) => void,
  ): () => void;
}
