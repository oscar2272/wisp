export type UserProfile = {
  name: string;
  avatar?: string;
  created_at?: string;
};

export type UserProfileWithEmail = {
  name: string;
  avatar: string;
  created_at: string;
  email: string;
};
