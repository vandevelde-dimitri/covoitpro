export interface IMessagingRepository {
  createConversation(announcementId: string): Promise<string>;
  addParticipant(conversationId: string, userId: string): Promise<void>;
  markConversationRead(conversationId: string, userId: string): Promise<void>;
}
