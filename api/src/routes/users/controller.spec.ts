import { describe, expect, test } from '@jest/globals';
import request from 'supertest';

const AUTHORIZATION_HEADER =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InJvbWFuIiwiaWF0IjoxNjg0NDc5Mjc4fQ.pRQfYRx6FiUYI74kNdU9giIv3nrXMZ61b423bwhbiUk';

const baseUrl = 'http://localhost:3000/api/v1';

describe('User controller', () => {
  test('Find user without Authorization header', async () => {
    const response = await request(baseUrl).get(`/users/me`);
    expect(response.statusCode).toBe(401);
  });

  test('Find user with Authorization header', async () => {
    const response = await request(baseUrl).get(`/users/me`).set('Authorization', AUTHORIZATION_HEADER);
    expect(response.statusCode).toBe(200);
  });

  // test('find user by token')
});
