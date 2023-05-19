export type UserData = {
  id: string;
  name: string;
  surname: string;
  avatar: string;
  login: string;
  is_admin: boolean;
  created_at: Date;
};

export type UserCreateData = Pick<UserData, 'login' | 'name' | 'surname' | 'avatar'> & {
  password: string;
};
