import { beforeAll, describe, expect, test } from '@jest/globals';
import request from 'supertest';

import { UserCreateData } from './types';

const generateUserData: () => UserCreateData = () => ({
  login: `ivan_${(Math.random() * 1000).toFixed(0)}`,
  password: '123',
  name: 'Ivan',
  surname: 'Ivanov',
  avatar: '',
});

describe('User controller', () => {
  describe('GET /users/me', () => {
    test('Find user without Authorization header', async () => {
      const response = await request(process.env.LOCALHOST).get('/users/me');
      expect(response.statusCode).toBe(404);
    });

    test('Find user with Authorization header', async () => {
      const response = await request(process.env.LOCALHOST).get('/users/me').set('Authorization', process.env.AUTH_USER!);
      expect(response.statusCode).toBe(200);
      expect(response.body.login).toBe('roman');
    });
  });

  describe('POST /users', () => {
    const newUser = generateUserData();

    test('Creating new user', async () => {
      const response = await request(process.env.LOCALHOST).post('/users').send(newUser);
      expect(response.statusCode).toBe(201);
      expect(typeof response.body.token).toBe(typeof '');
    });

    test('Creating user with existing login should return 409', async () => {
      const response = await request(process.env.LOCALHOST).post('/users').send(newUser);
      expect(response.statusCode).toBe(409);
    });
  });

  describe('DELETE /users/:id', () => {
    let createdUserId = 0;

    beforeAll(async () => {
      const newUser = generateUserData();
      const userCreateResponse = await request(process.env.LOCALHOST).post('/users').send(newUser);
      const createdUserAuth = `Bearer ${userCreateResponse.body.token}`;
      const createdUserResponse = await request(process.env.LOCALHOST).get('/users/me').set('Authorization', createdUserAuth);
      createdUserId = createdUserResponse.body.id;
    });

    test('Unauthorized delete should fail with 404', async () => {
      const response = await request(process.env.LOCALHOST).delete(`/users/${createdUserId}`);
      expect(response.statusCode).toBe(404);
    });

    test('Non-admin delete should fail with 404', async () => {
      const response = await request(process.env.LOCALHOST).delete(`/users/${createdUserId}`).set('Authorization', process.env.AUTH_USER!);
      expect(response.statusCode).toBe(404);
    });

    test('Admin should be able to delete a user', async () => {
      const response = await request(process.env.LOCALHOST).delete(`/users/${createdUserId}`).set('Authorization', process.env.AUTH_ADMIN!);
      expect(response.statusCode).toBe(204);
    });

    test('Deleting non-existent user user should return 404', async () => {
      const response = await request(process.env.LOCALHOST).delete('/users/0').set('Authorization', process.env.AUTH_ADMIN!);
      expect(response.statusCode).toBe(404);
    });
  });
});
