import { beforeAll, describe, expect, test } from '@jest/globals';
import request from 'supertest';

import { UserCreateData } from './types';

const AUTH_ADMIN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluIiwiaWF0IjoxNjg3ODc1MzQ2fQ.QGAwJRxNzrgJaMjptgW-1VGkkt2zFTNJvwzIFSafOsw';
const AUTH_USER =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InJvbWFuIiwiaWF0IjoxNjg3ODc1Mzg3fQ.2mpL3YylWDlKPlLL5dc27LUWNpqCxVyiTBrmibLC_xg';

const baseUrl = 'http://localhost:3000/api/v1';

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
      const response = await request(baseUrl).get('/users/me');
      expect(response.statusCode).toBe(400);
    });

    test('Find user with Authorization header', async () => {
      const response = await request(baseUrl).get('/users/me').set('Authorization', AUTH_USER);
      expect(response.statusCode).toBe(200);
      expect(response.body.login).toBe('roman');
    });
  });

  describe('POST /users', () => {
    const newUser = generateUserData();

    test('Creating new user', async () => {
      const response = await request(baseUrl).post('/users').send(newUser);
      expect(response.statusCode).toBe(201);
      expect(typeof response.body.token).toBe(typeof '');
    });

    test('Creating user with existing login should return 409', async () => {
      const response = await request(baseUrl).post('/users').send(newUser);
      expect(response.statusCode).toBe(409);
    });
  });

  describe('DELETE /users/:id', () => {
    let createdUserId = 0;

    beforeAll(async () => {
      const newUser = generateUserData();
      const userCreateResponse = await request(baseUrl).post('/users').send(newUser);
      const createdUserAuth = `Bearer ${userCreateResponse.body.token}`;
      const createdUserResponse = await request(baseUrl).get('/users/me').set('Authorization', createdUserAuth);
      createdUserId = createdUserResponse.body.id;
    });

    test('Unauthorized delete should fail with 400', async () => {
      const response = await request(baseUrl).delete(`/users/${createdUserId}`);
      expect(response.statusCode).toBe(400);
    });

    test('Non-admin delete should fail with 400', async () => {
      const response = await request(baseUrl).delete(`/users/${createdUserId}`).set('Authorization', AUTH_USER);
      expect(response.statusCode).toBe(400);
    });

    test('Admin should be able to delete a user', async () => {
      const response = await request(baseUrl).delete(`/users/${createdUserId}`).set('Authorization', AUTH_ADMIN);
      expect(response.statusCode).toBe(204);
    });

    test('Deleting non-existent user user should return 404', async () => {
      const response = await request(baseUrl).delete('/users/0').set('Authorization', AUTH_ADMIN);
      expect(response.statusCode).toBe(404);
    });
  });
});
