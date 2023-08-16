import { beforeAll, describe, expect, test } from '@jest/globals';
import request from 'supertest';

import { getAuthHeaders } from '../../test-setup';

describe('Comment controller', () => {
  let authHeaders: Record<string, [string, string]> = {};

  beforeAll(async () => {
    authHeaders = await getAuthHeaders();
  });

  describe('POST /comments', () => {
    test('Should respond with 401 to requests without Authorization header', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/comments')
        .send({ body: 'Nice post', post_id: 1 });
      expect(response.status).toBe(401);
    });

    test('Should add a comment', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/comments')
        .send({ body: 'Nice post', post_id: 1 })
        .set(...authHeaders.user);
      expect(response.status).toBe(201);
    });
  });

  describe('GET /comments', () => {
    test('Should find comments by post id', async () => {
      const { body: comments } = await request(process.env.LOCALHOST).get('/comments?post_id=1');
      expect(comments).toBeInstanceOf(Array);
      expect(comments[0]).toHaveProperty('id');
      expect(comments[0]).toHaveProperty('body');
      expect(comments[0]).toHaveProperty('created_by');
      expect(comments[0]).toHaveProperty('created_at');
      expect(comments[0]).toHaveProperty('updated_at');
    });
  });

  describe('DELETE /comments/:id', () => {
    test('User should be able to delete own comments', async () => {
      const { body: testComment } = await request(process.env.LOCALHOST)
        .post('/comments')
        .send({ body: 'Nice post', post_id: 1 })
        .set(...authHeaders.user);
      const response = await request(process.env.LOCALHOST)
        .delete(`/comments/${testComment.id}`)
        .set(...authHeaders.user);
      expect(response.status).toBe(204);
    });

    test('User should be able to delete comments of others', async () => {
      const { body: testComment } = await request(process.env.LOCALHOST)
        .post('/comments')
        .send({ body: 'Nice post', post_id: 1 })
        .set(...authHeaders.admin);
      const response = await request(process.env.LOCALHOST)
        .delete(`/comments/${testComment.id}`)
        .set(...authHeaders.user);
      expect(response.status).toBe(403);
    });

    test('Admin should only be able to delete any comment', async () => {
      const { body: testComment } = await request(process.env.LOCALHOST)
        .post('/comments')
        .send({ body: 'Nice post', post_id: 1 })
        .set(...authHeaders.user);
      const response = await request(process.env.LOCALHOST)
        .delete(`/comments/${testComment.id}`)
        .set(...authHeaders.admin);
      expect(response.status).toBe(204);
    });
  });
});
