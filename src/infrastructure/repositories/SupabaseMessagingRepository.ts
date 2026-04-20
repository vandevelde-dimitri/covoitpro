import { supabase } from "@/src/infrastructure/supabase";
import { IMessagingRepository } from "../../domain/repositories/MessagingRepository";

export class SupabaseMessagingRepository implements IMessagingRepository {
  private static instance: SupabaseMessagingRepository;

  private constructor() {}

  static getInstance(): SupabaseMessagingRepository {
    if (!SupabaseMessagingRepository.instance) {
      SupabaseMessagingRepository.instance = new SupabaseMessagingRepository();
    }
    return SupabaseMessagingRepository.instance;
  }

  async createConversation(announcementId: string): Promise<string> {
    const { data, error } = await supabase
      .from("conversations")
      .insert([{ annonce_id: announcementId }])
      .select()
      .single();

    if (error) {
      if (__DEV__)
        console.error("Détail erreur Supabase (Conversation):", error);
      throw error;
    }
    return data.id;
  }

  async addParticipant(conversationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("conversation_participants")
      .insert({ conversation_id: conversationId, user_id: userId });

    if (error) {
      if (__DEV__)
        console.error("Détail erreur Supabase (Participant):", error);
      throw error;
    }
  }

  async markConversationRead(
    conversationId: string,
    userId: string,
  ): Promise<void> {
    const { error } = await supabase
      .from("conversation_participants")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("user_id", userId);

    if (error) {
      if (__DEV__) console.error("Détail erreur Supabase (Mark Read):", error);
      throw error;
    }
  }
}
