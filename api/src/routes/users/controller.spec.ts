import { describe, expect, test } from '@jest/globals';
import request from 'supertest';

import { UserCreateData } from './types';

const AUTHORIZATION_HEADER =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InJvbWFuIiwiaWF0IjoxNjg0NDc5Mjc4fQ.pRQfYRx6FiUYI74kNdU9giIv3nrXMZ61b423bwhbiUk';

const baseUrl = 'http://localhost:3000/api/v1';

describe('User controller', () => {
  describe('GET /users/me', () => {
    test('Find user without Authorization header', async () => {
      const response = await request(baseUrl).get(`/users/me`);
      expect(response.statusCode).toBe(400);
    });

    test('Find user with Authorization header', async () => {
      const response = await request(baseUrl).get(`/users/me`).set('Authorization', AUTHORIZATION_HEADER);
      expect(response.statusCode).toBe(200);
      expect(response.body.login).toBe('roman');
    });
  });

  describe('POST /users', () => {
    const ivan: UserCreateData = {
      login: `ivan_${(Math.random() * 100).toFixed(0)}`,
      password: '123',
      name: 'Ivan',
      surname: 'Ivanov',
      avatar: '',
    };

    test('Creating new user', async () => {
      const response = await request(baseUrl).post(`/users`).send(ivan);
      expect(response.statusCode).toBe(201);
      expect(typeof response.body.token).toBe(typeof '');
    });

    test('Creating user with existing login should return 409', async () => {
      const response = await request(baseUrl).post(`/users`).send(ivan);
      expect(response.statusCode).toBe(409);
    });
  });
});
