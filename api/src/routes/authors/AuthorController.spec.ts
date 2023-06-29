import { beforeEach, describe, expect, test } from '@jest/globals';
import request from 'supertest';

describe('Author controller', () => {
  describe('POST /authors', () => {
    let testUserId: number;

    beforeEach(async () => {
      const userCreateResponse = await request(process.env.LOCALHOST)
        .post('/users')
        .send({
          login: `ivan_${Math.random()}`,
          password: '123',
          name: 'Ivan',
          surname: 'Ivanov',
          avatar: '',
        });
      const createdUserAuth = `Bearer ${userCreateResponse.body.token}`;
      const createdUserResponse = await request(process.env.LOCALHOST)
        .get('/users/me')
        .set('Authorization', createdUserAuth);
      testUserId = createdUserResponse.body.id;
    });

    test('Should respond with 404 to unathorized requests', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/authors')
        .send({ user_id: testUserId, description: 'lorem ipsum' });
      expect(response.statusCode).toBe(404);
    });

    test('Should respond with 404 to non-admins', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/authors')
        .send({ user_id: testUserId, description: 'lorem ipsum' })
        .set('Authorization', process.env.AUTH_USER!);
      expect(response.statusCode).toBe(404);
    });

    test('Should create an author and respond with 201 on success', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/authors')
        .send({ user_id: testUserId, description: 'lorem ipsum' })
        .set('Authorization', process.env.AUTH_ADMIN!);
      expect(response.statusCode).toBe(201);
    });

    test('Should respond with 409 when sent user is already an author', async () => {
      await request(process.env.LOCALHOST)
        .post('/authors')
        .send({ user_id: testUserId, description: 'lorem ipsum' })
        .set('Authorization', process.env.AUTH_ADMIN!);
      const response = await request(process.env.LOCALHOST)
        .post('/authors')
        .send({ user_id: testUserId, description: 'lorem ipsum' })
        .set('Authorization', process.env.AUTH_ADMIN!);
      expect(response.statusCode).toBe(409);
    });
  });

  describe('GET /authors', () => {
    test('Should respond with 404 to unathorized requests', async () => {
      const response = await request(process.env.LOCALHOST).get('/authors');
      expect(response.statusCode).toBe(404);
    });

    test('Should respond with 404 to non-admins', async () => {
      const response = await request(process.env.LOCALHOST)
        .get('/authors')
        .set('Authorization', process.env.AUTH_USER!);
      expect(response.statusCode).toBe(404);
    });

    test('Should respond with 200 and send authors list', async () => {
      const response = await request(process.env.LOCALHOST)
        .get('/authors')
        .set('Authorization', process.env.AUTH_ADMIN!);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('user_id');
      expect(response.body[0]).toHaveProperty('description');
    });
  });
});
