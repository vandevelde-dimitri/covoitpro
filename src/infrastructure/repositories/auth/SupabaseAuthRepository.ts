import { IAuthRepository } from "@/src/domain/repositories/auth/AuthRepository";
import { supabase } from "../../supabase";

export class SupabaseAuthRepository implements IAuthRepository {
  private static instance: SupabaseAuthRepository;

  private constructor() {}

  static getInstance(): SupabaseAuthRepository {
    if (!SupabaseAuthRepository.instance) {
      SupabaseAuthRepository.instance = new SupabaseAuthRepository();
    }
    return SupabaseAuthRepository.instance;
  }

  async login(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (__DEV__) console.error("Login error:", error.message);
      throw new Error(error.message);
    }
  }

  async register(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      if (__DEV__) console.error("Register error:", error.message);
      throw new Error(error.message);
    }
  }

  async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      if (__DEV__) console.error("Update password error:", error.message);
      throw new Error(error.message);
    }
  }

  async updateEmail(email: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ email });

    if (error) {
      if (__DEV__) console.error("Update email error:", error.message);
      throw new Error(error.message);
    }
  }

  async resetPasswordEmail(email: string, redirectTo: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });

    if (error) throw new Error(error.message);
  }

  async getCurrentUserId(): Promise<string> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      if (__DEV__) console.error("Get current user error:", error?.message);
      throw new Error("Utilisateur non authentifié");
    }

    return user.id;
  }
}
