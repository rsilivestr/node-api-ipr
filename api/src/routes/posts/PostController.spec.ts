import { beforeAll, describe, expect, test } from '@jest/globals';
import request from 'supertest';

import { getAuthHeaders } from '../../test-setup';

describe('Post controller', () => {
  const testPost = {
    title: 'Test post',
    body: 'Lorem ipsum dolor sit amet',
    category_id: 1,
    tags: [1, 2],
  };

  let authHeaders: Record<string, [string, string]> = {};

  beforeAll(async () => {
    authHeaders = await getAuthHeaders();
  });

  describe('POST /posts', () => {
    test('Should respond with 404 to unauthorized request', async () => {
      const response = await request(process.env.LOCALHOST).post('/posts').send(testPost);
      expect(response.statusCode).toBe(404);
    });

    test('Should respond with 201 to authorized author', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/posts')
        .send(testPost)
        .set(...authHeaders.user);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });
});
