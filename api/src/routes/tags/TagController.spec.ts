import { describe, expect, test } from '@jest/globals';
import request from 'supertest';

describe('Tag controller', () => {
  describe('GET /tags', () => {
    test('Should return an array of tags', async () => {
      const response = await request(process.env.LOCALHOST).get('/tags');
      expect(response.statusCode).toBe(200);
      expect(typeof response.body).toBe(typeof []);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });
  });

  describe('GET /tags/:id', () => {
    test('Should return existing tag', async () => {
      const response = await request(process.env.LOCALHOST).get('/tags/1');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
    });

    test('Should return 404 for nonexistent tags', async () => {
      const response = await request(process.env.LOCALHOST).get('/tags/0');
      expect(response.statusCode).toBe(404);
    });
  });

  describe('POST /tags', () => {
    test('Should return 404 to unauthorized requests', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/tags')
        .send({ name: `Test ${Math.random()}` });
      expect(response.statusCode).toBe(404);
    });

    test('Should return 404 to non-admin users', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/tags')
        .send({ name: `Test ${Math.random()}` })
        .set('Authorization', process.env.AUTH_USER!);
      expect(response.statusCode).toBe(404);
    });

    test('Should create a tag and return created tag id with statusCode of 201 to admin users', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/tags')
        .send({ name: `Test ${Math.random()}` })
        .set('Authorization', process.env.AUTH_ADMIN!);
      expect(response.statusCode).toBe(201);
      expect(typeof response.body.id).toBe(typeof 1);
    });
  });

  describe('PATCH /tags/:id', () => {
    test('Should return 404 to unauthorized requests', async () => {
      const response = await request(process.env.LOCALHOST)
        .patch('/tags/1')
        .send({ name: `Test ${Math.random()}` });
      expect(response.statusCode).toBe(404);
    });

    test('Should return 404 to non-admin users', async () => {
      const response = await request(process.env.LOCALHOST)
        .patch('/tags/1')
        .send({ name: `Test ${Math.random()}` })
        .set('Authorization', process.env.AUTH_USER!);
      expect(response.statusCode).toBe(404);
    });

    test('Should return 204 to admin users', async () => {
      const response = await request(process.env.LOCALHOST)
        .patch('/tags/1')
        .send({ name: `Test ${Math.random()}` })
        .set('Authorization', process.env.AUTH_ADMIN!);
      expect(response.statusCode).toBe(204);
    });
  });
});
