import { beforeAll, describe, expect, test } from '@jest/globals';
import request from 'supertest';

import { getAuthHeaders } from '../../test-setup';

describe('Tag controller', () => {
  let authHeaders: Record<string, [string, string]> = {};

  beforeAll(async () => {
    authHeaders = await getAuthHeaders();
  });

  describe('POST /categories', () => {
    test('Should respond with 404 to unauthorized requests', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/categories')
        .send({ name: `Test ${Math.random()}` });
      expect(response.statusCode).toBe(404);
    });

    test('Should respond with 404 to non-admin user requests', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/categories')
        .send({ name: `Test ${Math.random()}` })
        .set(...authHeaders.user);
      expect(response.statusCode).toBe(404);
    });

    test('Should create a category and respond with 201 to admin', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/categories')
        .send({ name: `Test ${Math.random()}` })
        .set(...authHeaders.admin);
      expect(response.statusCode).toBe(201);
    });

    test('Should create a category with name and parent_id', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/categories')
        .send({ name: `Test ${Math.random()}`, parent_id: 1 })
        .set(...authHeaders.admin);
      expect(response.statusCode).toBe(201);
    });

    test('Should respond with 409 if category name already exists', async () => {
      const name = `Test ${Math.random()}`;
      await request(process.env.LOCALHOST)
        .post('/categories')
        .send({ name })
        .set(...authHeaders.admin);

      const response = await request(process.env.LOCALHOST)
        .post('/categories')
        .send({ name })
        .set(...authHeaders.admin);

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

    test('Should return 404 if not found', async () => {
      const response1 = await request(process.env.LOCALHOST).get('/categories/0');
      const response2 = await request(process.env.LOCALHOST).get('/categories/99999');
      expect(response1.statusCode).toBe(404);
      expect(response2.statusCode).toBe(404);
    });
  });

  describe('PATCH /categories/:id', () => {
    test('Should respond with 404 to unauthorized request', async () => {
      const response = await request(process.env.LOCALHOST)
        .patch('/categories/2')
        .send({ name: 'New category name' });
      expect(response.statusCode).toBe(404);
    });

    test('Should respond with 404 to non-admin request', async () => {
      const response = await request(process.env.LOCALHOST)
        .patch('/categories/2')
        .send({ name: 'New category name' })
        .set(...authHeaders.user);
      expect(response.statusCode).toBe(404);
    });

    test('Should respond with 204 to authorized admin request', async () => {
      const response = await request(process.env.LOCALHOST)
        .patch('/categories/2')
        .send({ name: 'New category name' })
        .set(...authHeaders.admin);
      expect(response.statusCode).toBe(204);
    });

    test('Should not affect fields that are not provided', async () => {
      const expectedName = `Test ${Math.PI.toFixed(5)}`;
      const expectedParent = 1;

      await request(process.env.LOCALHOST)
        .patch('/categories/3')
        .send({ name: expectedName })
        .set(...authHeaders.admin);
      await request(process.env.LOCALHOST)
        .patch('/categories/3')
        .send({ parent_id: expectedParent })
        .set(...authHeaders.admin);

      const response = await request(process.env.LOCALHOST).get('/categories/3');

      expect(response.body.name).toBe(expectedName);
      expect(response.body.parent_id).toBe(expectedParent);
    });

    test('Should not be able to set parent_id === id', async () => {
      const result = await request(process.env.LOCALHOST)
        .patch('/categories/3')
        .send({ parent_id: 3 })
        .set(...authHeaders.admin);
      expect(result.statusCode).toBe(400);
    });

    test('Should respond with 500 if new parent category id does not exist', async () => {
      const response = await request(process.env.LOCALHOST)
        .patch('/categories/3')
        .send({ parent_id: 0 })
        .set(...authHeaders.admin);
      expect(response.statusCode).toBe(500);
    });
  });

  describe('DELETE /categories/:id', () => {
    let testId: number;

    beforeAll(async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/categories')
        .send({ name: `Test ${Math.random()}` })
        .set(...authHeaders.admin);
      testId = response.body.id;
    });

    test('Should respond with 404 to unauthorized request', async () => {
      const response = await request(process.env.LOCALHOST).delete(`/categories/${testId}`);
      expect(response.statusCode).toBe(404);
    });

    test('Should respond with 404 to non-admin request', async () => {
      const response = await request(process.env.LOCALHOST)
        .delete(`/categories/${testId}`)
        .set(...authHeaders.user);
      expect(response.statusCode).toBe(404);
    });

    test('Should respond with 204 admin request', async () => {
      const response = await request(process.env.LOCALHOST)
        .delete(`/categories/${testId}`)
        .set(...authHeaders.admin);
      expect(response.statusCode).toBe(204);
    });

    test('Should respond with 404 when deleting nonexistent category', async () => {
      const response = await request(process.env.LOCALHOST)
        .delete('/categories/0')
        .set(...authHeaders.admin);
      expect(response.statusCode).toBe(404);
    });
  });
});
