import { beforeAll, describe, expect, test } from '@jest/globals';
import request from 'supertest';

import { getAuthHeaders } from '../../test-setup';

describe('Tag controller', () => {
  let authHeaders: Record<string, [string, string]> = {};

  beforeAll(async () => {
    authHeaders = await getAuthHeaders();
  });

  describe('GET /tags', () => {
    test('Should return an array of tags', async () => {
      const response = await request(process.env.LOCALHOST).get('/tags');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
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
        .set(...authHeaders.user);
      expect(response.statusCode).toBe(404);
    });

    test('Should create a tag and return created tag id with statusCode of 201 to admin users', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/tags')
        .send({ name: `Test ${Math.random()}` })
        .set(...authHeaders.admin);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('PATCH /tags/:id', () => {
    test('Should return 404 to unauthorized requests', async () => {
      const response = await request(process.env.LOCALHOST)
        .patch('/tags/1')
        .send({ name: 'Tag One' });
      expect(response.statusCode).toBe(404);
    });

    test('Should return 404 to non-admin users', async () => {
      const response = await request(process.env.LOCALHOST)
        .patch('/tags/1')
        .send({ name: 'Tag One' })
        .set(...authHeaders.user);
      expect(response.statusCode).toBe(404);
    });

    test('Should return 204 to admin users', async () => {
      const response = await request(process.env.LOCALHOST)
        .patch('/tags/1')
        .send({ name: 'Tag One' })
        .set(...authHeaders.admin);
      expect(response.statusCode).toBe(204);
    });
  });

  describe('DELETE /tags/:id', () => {
    let testId: number;

    beforeAll(async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/tags')
        .send({ name: `Test ${Math.random()}` })
        .set(...authHeaders.admin);
      testId = response.body.id;
    });

    test('Should return 404 to unauthorized requests', async () => {
      const response = await request(process.env.LOCALHOST).delete(`/tags/${testId}`);
      expect(response.statusCode).toBe(404);
    });

    test('Should return 404 to non-admin users', async () => {
      const response = await request(process.env.LOCALHOST)
        .delete(`/tags/${testId}`)
        .set(...authHeaders.user);
      expect(response.statusCode).toBe(404);
    });

    test('Should return 204 to admin users', async () => {
      const response = await request(process.env.LOCALHOST)
        .delete(`/tags/${testId}`)
        .set(...authHeaders.admin);
      expect(response.statusCode).toBe(204);
    });

    test('Should return 404 to admin users if id does not exist', async () => {
      const response = await request(process.env.LOCALHOST)
        .delete('/tags/0')
        .set(...authHeaders.admin);
      expect(response.statusCode).toBe(404);
    });
  });
});
