export interface IAuthRepository {
  login(email: string, password: string): Promise<void>;
  register(email: string, password: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
  updateEmail(email: string): Promise<void>;
  resetPasswordEmail(email: string, redirectTo: string): Promise<void>;
  getCurrentUserId(): Promise<string>;
}
