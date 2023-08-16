import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import request from 'supertest';

import { getAuthHeaders } from '../../test-setup';

describe('Comment controller', () => {
  let authHeaders: Record<string, [string, string]> = {};

  beforeAll(async () => {
    authHeaders = await getAuthHeaders();
  });

  describe('POST /drafts', () => {
    test('Should respond with 401 if Authorization header is empty', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/drafts')
        .send({ post_id: 1, body: 'Draft body' });
      expect(response.status).toBe(401);
    });

    test('Should create a draft', async () => {
      const response = await request(process.env.LOCALHOST)
        .post('/drafts')
        .send({ post_id: 1, body: 'Draft body' })
        .set(...authHeaders.user);
      expect(response.status).toBe(201);
    });
  });

  describe('GET /drafts', () => {
    test('Should find all drafts of the author', async () => {
      const { body: drafts } = await request(process.env.LOCALHOST)
        .get('/drafts')
        .set(...authHeaders.user);
      expect(drafts).toBeInstanceOf(Array);
      expect(drafts[0]).toHaveProperty('id');
      expect(drafts[0]).toHaveProperty('author_id');
      expect(drafts[0]).toHaveProperty('post_id');
    });

    test('Should find all drafts of the author related to some post', async () => {
      const { body: drafts } = await request(process.env.LOCALHOST)
        .get('/drafts?post_id=1')
        .set(...authHeaders.user);
      expect(drafts).toBeInstanceOf(Array);
      expect(drafts[0]).toHaveProperty('id');
      expect(drafts[0]).toHaveProperty('author_id');
      expect(drafts[0]).toHaveProperty('post_id');
    });
  });

  describe('GET /drafts/:id', () => {
    test('Should find draft by id', async () => {
      const { body: draft } = await request(process.env.LOCALHOST)
        .get('/drafts/1')
        .set(...authHeaders.user);
      expect(draft).toHaveProperty('id');
      expect(draft).toHaveProperty('author_id');
      expect(draft).toHaveProperty('post_id');
    });
  });

  describe('PUT /drafts/:id', () => {
    test('Should be able to update own draft', async () => {
      const response = await request(process.env.LOCALHOST)
        .put('/drafts/1')
        .send({ title: 'Changed draft title', body: 'Changed draft body' })
        .set(...authHeaders.user);
      expect(response.status).toBe(204);
    });

    test('Should respond with 404 if draft does not exist', async () => {
      const response = await request(process.env.LOCALHOST)
        .put('/drafts/100500')
        .send({ title: 'Changed draft title', body: 'Changed draft body' })
        .set(...authHeaders.user);
      expect(response.status).toBe(404);
    });

    test('Should respond with 404 if draft is not owned by requestor', async () => {
      const response = await request(process.env.LOCALHOST)
        .put('/drafts/100500')
        .send({ title: 'Changed draft title', body: 'Changed draft body' })
        .set(...authHeaders.admin);
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /drafts/:id', () => {
    let testDraftId: number;

    beforeEach(async () => {
      const { body: draft } = await request(process.env.LOCALHOST)
        .post('/drafts')
        .send({ post_id: 1, body: 'Draft body' })
        .set(...authHeaders.user);
      testDraftId = draft.id;
    });

    test('Should be able to delete owned draft', async () => {
      const response = await request(process.env.LOCALHOST)
        .delete(`/drafts/${testDraftId}`)
        .set(...authHeaders.user);
      expect(response.status).toBe(204);
    });

    test('Should respond with 404 if draft does not exist', async () => {
      const response = await request(process.env.LOCALHOST)
        .delete(`/drafts/100500`)
        .set(...authHeaders.user);
      expect(response.status).toBe(404);
    });

    test('Should respond with 404 if draft is not owned', async () => {
      const response = await request(process.env.LOCALHOST)
        .delete(`/drafts/${testDraftId}`)
        .set(...authHeaders.admin);
      expect(response.status).toBe(404);
    });
  });

  // describe('POST /drafts/:id/publish', () => {});
});
