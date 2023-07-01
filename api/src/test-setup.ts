import request from 'supertest';

export const getAuthHeaders = async () => {
  const { body: userTokens } = await request(process.env.LOCALHOST)
    .post('/auth')
    .send({ login: process.env.USER_LOGIN, password: process.env.USER_PASSWORD });
  const user: ['Authorization', string] = ['Authorization', `Bearer ${userTokens.accessToken}`];

  const { body: adminTokens } = await request(process.env.LOCALHOST)
    .post('/auth')
    .send({ login: process.env.ADMIN_LOGIN, password: process.env.ADMIN_PASSWORD });
  const admin: ['Authorization', string] = ['Authorization', `Bearer ${adminTokens.accessToken}`];

  return { user, admin };
};
