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

  describe('GET /posts', () => {
    test('Should get a list of posts', async () => {
      const response = await request(process.env.LOCALHOST).get('/posts');
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('body');
      expect(response.body[0]).toHaveProperty('poster');
      expect(response.body[0]).toHaveProperty('images');
      expect(response.body[0]).toHaveProperty('author');
      expect(response.body[0]).toHaveProperty('categories');
      expect(response.body[0]).toHaveProperty('tags');
    });

    test('Posts should be paginated', async () => {
      const page1 = await request(process.env.LOCALHOST).get('/posts?limit=3');
      const page2 = await request(process.env.LOCALHOST).get('/posts?limit=3&offset=3');
      expect(page1.body.length).toBe(3);
      expect(page2.body.length).toBeLessThanOrEqual(3);
      expect(page2.body[0].id).toBeGreaterThan(page1.body[2].id);
    });

    test('Posts should support filtering by author', async () => {
      const response1 = await request(process.env.LOCALHOST).get('/posts?author=roman');
      for (const post of response1.body) {
        expect(post.author.name).toBe('Roman');
      }
      const response2 = await request(process.env.LOCALHOST).get('/posts?author=doe');
      for (const post of response2.body) {
        expect(post.author.name).toBe('John');
      }
    });

    test('Posts should support filtering by category', async () => {
      const response = await request(process.env.LOCALHOST).get('/posts?category=1');
      for (const post of response.body) {
        expect(post.categories).toContain('Category 1');
      }
    });

    test('Posts should support filtering by content', async () => {
      const response = await request(process.env.LOCALHOST).get('/posts?content=ipsum');
      for (const post of response.body) {
        expect(post.body).toMatch(/ipsum/gi);
      }
    });

    test('Posts should support filtering by a tag', async () => {
      const response = await request(process.env.LOCALHOST).get('/posts?tag=2');
      for (const post of response.body) {
        expect(post.tags).toContain('Tag 2');
      }
    });

    test('Posts should support filtering by any tag in a list', async () => {
      const response = await request(process.env.LOCALHOST).get('/posts?tags__in=[3,4,5]');
      for (const post of response.body) {
        expect(post.tags.some((tag: string) => ['Tag 3', 'Tag 4', 'Tag 5'].includes(tag))).toBeTruthy();
      }
    });

    test('Posts should support filtering by all the tags in a list', async () => {
      const response = await request(process.env.LOCALHOST).get('/posts?tags__all=[3,4]');
      for (const post of response.body) {
        expect(post.tags).toContain('Tag 3');
        expect(post.tags).toContain('Tag 4');
      }
    });

    test('Posts should support filtering by title', async () => {
      const response = await request(process.env.LOCALHOST).get('/posts?title=about');
      for (const post of response.body) {
        expect(post.title).toMatch(/about/gi);
      }
    });
  });
});
