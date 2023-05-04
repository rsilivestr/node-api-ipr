export type UserData = {
  id: string;
  name?: string;
  surname?: string;
  avatar?: string;
  login: string;
  isAdmin: boolean;
  isAuthor: boolean;
  description?: string;
  createdAt: Date;
};
