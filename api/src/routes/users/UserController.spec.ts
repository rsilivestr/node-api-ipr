import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import request from 'supertest';

import { getAuthHeaders } from '../../test-setup';
import { UserCreateData } from './types';

const generateUserData: () => UserCreateData = () => ({
  login: `ivan_${(Math.random() * 1000).toFixed(0)}`,
  password: '123',
  name: 'Ivan',
  surname: 'Ivanov',
  avatar: '',
});

describe('User controller', () => {
  let authHeaders: Record<string, [string, string]> = {};

  beforeAll(async () => {
    authHeaders = await getAuthHeaders();
  });

  describe('GET /users/me', () => {
    test('Find user without Authorization header', async () => {
      const response = await request(process.env.LOCALHOST).get('/users/me');
      expect(response.statusCode).toBe(404);
    });

    test('Find user with Authorization header', async () => {
      const response = await request(process.env.LOCALHOST)
        .get('/users/me')
        .set(...authHeaders.user);
      expect(response.statusCode).toBe(200);
      expect(response.body.login).toBe('roman');
    });
  });

  describe('POST /users', () => {
    const newUser = generateUserData();

    test('Creating new user', async () => {
      const response = await request(process.env.LOCALHOST).post('/users').send(newUser);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    test('Creating user with existing login should return 409', async () => {
      const response = await request(process.env.LOCALHOST).post('/users').send(newUser);
      expect(response.statusCode).toBe(409);
    });
  });

  describe('DELETE /users/:id', () => {
    let testId: number;

    beforeEach(async () => {
      const newUser = generateUserData();
      const userCreateResponse = await request(process.env.LOCALHOST).post('/users').send(newUser);
      const createdUserAuth = `Bearer ${userCreateResponse.body.accessToken}`;
      const createdUserResponse = await request(process.env.LOCALHOST)
        .get('/users/me')
        .set('Authorization', createdUserAuth);

      testId = createdUserResponse.body.id;
    });

    test('Unauthorized delete should fail with 404', async () => {
      const response = await request(process.env.LOCALHOST).delete(`/users/${testId}`);
      expect(response.statusCode).toBe(404);
    });

    test('Non-admin delete should fail with 404', async () => {
      const response = await request(process.env.LOCALHOST)
        .delete(`/users/${testId}`)
        .set(...authHeaders.user);
      expect(response.statusCode).toBe(404);
    });

    test('Admin should be able to delete a user', async () => {
      const response = await request(process.env.LOCALHOST)
        .delete(`/users/${testId}`)
        .set(...authHeaders.admin);
      expect(response.statusCode).toBe(204);
    });

    test('Deleting non-existent user user should return 404', async () => {
      const response = await request(process.env.LOCALHOST)
        .delete('/users/0')
        .set(...authHeaders.admin);
      expect(response.statusCode).toBe(404);
    });
  });
});
