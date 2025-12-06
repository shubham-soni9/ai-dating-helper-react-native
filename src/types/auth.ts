export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  userId: string;
  email?: string;
};

export type UserProfile = {
  id: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
};
