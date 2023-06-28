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

  describe('PATCH /categories/:id', () => {
    test('Should respond with 404 to unauthorized request', async () => {
      const response = await request(process.env.LOCALHOST).patch('/categories/2').send({ name: 'New category name' });
      expect(response.statusCode).toBe(404);
    });

    test('Should respond with 404 to non-admin request', async () => {
      const response = await request(process.env.LOCALHOST)
        .patch('/categories/2')
        .send({ name: 'New category name' })
        .set('Authorization', process.env.AUTH_USER!);
      expect(response.statusCode).toBe(404);
    });

    test('Should respond with 204 to authorized admin request', async () => {
      const response = await request(process.env.LOCALHOST)
        .patch('/categories/2')
        .send({ name: 'New category name' })
        .set('Authorization', process.env.AUTH_ADMIN!);
      expect(response.statusCode).toBe(204);
    });

    test('Should not affect fields that are not provided', async () => {
      const expectedName = `Test ${Math.PI.toFixed(5)}`;
      const expectedParent = 1;

      await request(process.env.LOCALHOST)
        .patch('/categories/3')
        .send({ name: expectedName })
        .set('Authorization', process.env.AUTH_ADMIN!);
      await request(process.env.LOCALHOST)
        .patch('/categories/3')
        .send({ parent_id: expectedParent })
        .set('Authorization', process.env.AUTH_ADMIN!);

      const response = await request(process.env.LOCALHOST).get('/categories/3');

      expect(response.body.name).toEqual(expectedName);
      expect(response.body.parent_id).toEqual(expectedParent);
    });

    test('Should not be able to set parent_id === id', async () => {
      const result = await request(process.env.LOCALHOST)
        .patch('/categories/3')
        .send({ parent_id: 3 })
        .set('Authorization', process.env.AUTH_ADMIN!);
      expect(result.statusCode).toBe(400);
    });

    test('Should respond with 500 if new parent category id does not exist', async () => {
      const response = await request(process.env.LOCALHOST)
        .patch('/categories/3')
        .send({ parent_id: 0 })
        .set('Authorization', process.env.AUTH_ADMIN!);
      expect(response.statusCode).toBe(500);
    });
  });
});
