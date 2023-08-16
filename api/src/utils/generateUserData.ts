import { randomBytes } from 'crypto';

export const generateUserData = () => ({
  login: `u${randomBytes(10).toString('hex')}`,
  password: '123',
  name: 'Ivan',
  surname: 'Ivanov',
  avatar: '',
});
