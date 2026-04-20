import { ISessionRepository } from "@/src/domain/repositories/SessionRepository";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../supabase";

export class SupabaseSessionRepository implements ISessionRepository {
  private static instance: SupabaseSessionRepository;

  private constructor() {}

  static getInstance(): SupabaseSessionRepository {
    if (!SupabaseSessionRepository.instance) {
      SupabaseSessionRepository.instance = new SupabaseSessionRepository();
    }
    return SupabaseSessionRepository.instance;
  }

  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      if (__DEV__) console.error("Get session error:", error.message);
      throw new Error(error.message);
    }
    return data?.session ?? null;
  }

  async refreshSession(): Promise<void> {
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      if (__DEV__) console.error("Refresh session error:", error.message);
      throw new Error(error.message);
    }
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      if (__DEV__) console.error("Logout error:", error.message);
      throw new Error(error.message);
    }
  }

  async setSession(accessToken: string, refreshToken: string): Promise<void> {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      if (__DEV__) console.error("Set session error:", error.message);
      throw new Error(error.message);
    }
  }

  onSessionChange(
    callback: (event: string, session: Session | null) => void,
  ): () => void {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return () => subscription?.unsubscribe();
  }
}
