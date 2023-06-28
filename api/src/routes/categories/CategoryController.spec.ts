import { beforeAll, describe, expect, test } from '@jest/globals';
import request from 'supertest';

describe('Tag controller', () => {
  describe('POST /categories', () => {
    test('Should respond with 404 to unathorized requests', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/categories')
        .send({ name: `Test ${Math.random()}` });
      expect(response.statusCode).toBe(404);
    });

    test('Should respond with 404 to non-admin user requests', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/categories')
        .send({ name: `Test ${Math.random()}` })
        .set('Authorization', process.env.AUTH_USER!);
      expect(response.statusCode).toBe(404);
    });

    test('Should create a category and respond with 201 to admin', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/categories')
        .send({ name: `Test ${Math.random()}` })
        .set('Authorization', process.env.AUTH_ADMIN!);
      expect(response.statusCode).toBe(201);
    });

    test('Should create a category with name and parent_id', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/categories')
        .send({ name: `Test ${Math.random()}`, parent_id: 1 })
        .set('Authorization', process.env.AUTH_ADMIN!);
      expect(response.statusCode).toBe(201);
    });

    test('Should respond with 409 if category name already exists', async () => {
      await request(process.env.LOCALHOST)
        .post('/categories')
        .send({ name: `Test 999` })
        .set('Authorization', process.env.AUTH_ADMIN!);

      const response = await request(process.env.LOCALHOST)
        .post('/categories')
        .send({ name: `Test 999` })
        .set('Authorization', process.env.AUTH_ADMIN!);

      expect(response.statusCode).toBe(409);
    });
  });

  describe('GET /categories', () => {
    test('Should return category array', async () => {
      const response = await request(process.env.LOCALHOST).get('/categories');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('parent_id');
    });
  });

  describe('GET /categories/:id', () => {
    test('Should return existing category', async () => {
      const response = await request(process.env.LOCALHOST).get('/categories/1');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('parent_id');
    });
  });
});
