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
    test('Should respond with a list of posts', async () => {
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

    test('Should be paginated', async () => {
      const page1 = await request(process.env.LOCALHOST).get('/posts?limit=3');
      const page2 = await request(process.env.LOCALHOST).get('/posts?limit=3&offset=3');
      expect(page1.body.length).toBe(3);
      expect(page2.body.length).toBeLessThanOrEqual(3);
      expect(page2.body[0].id).toBeGreaterThan(page1.body[2].id);
    });

    test('Should support filtering by author', async () => {
      const response1 = await request(process.env.LOCALHOST).get('/posts?author=roman');
      for (const post of response1.body) {
        expect(post.author.name).toMatch('Roman');
      }
      const response2 = await request(process.env.LOCALHOST).get('/posts?author=doe');
      for (const post of response2.body) {
        expect(post.author.surname).toMatch('Doe');
      }
    });

    test('Should support filtering by category', async () => {
      const response = await request(process.env.LOCALHOST).get('/posts?category=1');
      for (const post of response.body) {
        expect(post.categories).toContain('Category 1');
      }
    });

    test('Should support filtering by content', async () => {
      const response = await request(process.env.LOCALHOST).get('/posts?content=ipsum');
      for (const post of response.body) {
        expect(post.body).toMatch(/ipsum/gi);
      }
    });

    test('Should support filtering by date', async () => {
      const testDate = '2020-05-12';
      const response = await request(process.env.LOCALHOST).get(`/posts?created_at=${testDate}`);
      expect(response.body).toHaveLength(1);
      expect(new Date(response.body[0].created_at).getTime()).toBe(new Date(testDate).getTime());
    });

    test('Should support filtering by date greater than provided', async () => {
      const testDate = '2021-01-01';
      const testTimestamp = new Date(testDate).getTime();
      const response = await request(process.env.LOCALHOST).get(
        `/posts?created_at__gt=${testDate}`
      );
      expect(response.body.length).toBeGreaterThan(1);
      for (const post of response.body) {
        expect(new Date(post.created_at).getTime()).toBeGreaterThan(testTimestamp);
      }
    });

    test('Should support filtering by date less than provided', async () => {
      const testDate = '2021-01-01';
      const testTimestamp = new Date(testDate).getTime();
      const response = await request(process.env.LOCALHOST).get(
        `/posts?created_at__lt=${testDate}`
      );
      expect(response.body.length).toBeGreaterThan(1);
      for (const post of response.body) {
        expect(new Date(post.created_at).getTime()).toBeLessThan(testTimestamp);
      }
    });

    test('Should support filtering by a search term found in title', async () => {
      const term = 'ducks';
      const response = await request(process.env.LOCALHOST).get(`/posts?search=${term}`);
      expect(response.body.length).toBeGreaterThan(0);
      for (const post of response.body) {
        expect(post.title).toMatch(new RegExp(term, 'i'));
      }
    });

    test('Should support filtering by a search term found in body', async () => {
      const term = 'awesome';
      const response = await request(process.env.LOCALHOST).get(`/posts?search=${term}`);
      expect(response.body.length).toBeGreaterThan(0);
      for (const post of response.body) {
        expect(post.body).toMatch(new RegExp(term, 'i'));
      }
    });

    test('Should support filtering by a search term found in author name', async () => {
      const term = 'roman';
      const response = await request(process.env.LOCALHOST).get(`/posts?search=${term}`);
      expect(response.body.length).toBeGreaterThan(0);
      for (const post of response.body) {
        expect(post.author.name).toMatch(new RegExp(term, 'i'));
      }
    });

    test('Should support filtering by a search term found in author surname', async () => {
      const term = 'romanov';
      const response = await request(process.env.LOCALHOST).get(`/posts?search=${term}`);
      expect(response.body.length).toBeGreaterThan(0);
      for (const post of response.body) {
        expect(post.author.surname).toMatch(new RegExp(term, 'i'));
      }
    });

    test('Should support filtering by a search term found in a tag name', async () => {
      const term = 'Tag 2';
      const response = await request(process.env.LOCALHOST).get(`/posts?search=${term}`);
      expect(response.body.length).toBeGreaterThan(0);
      for (const post of response.body) {
        expect(post.tags).toContain(term);
      }
    });

    test('Should support filtering by a search term found in a category name', async () => {
      const term = 'Category 1';
      const response = await request(process.env.LOCALHOST).get(`/posts?search=${term}`);
      expect(response.body.length).toBeGreaterThan(0);
      for (const post of response.body) {
        expect(post.categories).toContain(term);
      }
    });

    test('Should sort by author full name', async () => {
      const { body: posts } = await request(process.env.LOCALHOST).get('/posts?order=author');
      expect(posts.length).toBeGreaterThan(0);
      for (let i = 1; i < posts.length; i++) {
        const author = `${posts[i].author.surname} ${posts[i].author.name}`;
        const prevAuthor = `${posts[i - 1].author.surname} ${posts[i - 1].author.name}`;
        expect(author.localeCompare(prevAuthor)).toBeGreaterThanOrEqual(0);
      }
    });

    test('Should test by category', async () => {
      const { body: posts } = await request(process.env.LOCALHOST).get('/posts?order=category');
      expect(posts.length).toBeGreaterThan(0);
      for (let i = 1; i < posts.length; i++) {
        const category: string = posts[i].categories[0];
        const prevCategory: string = posts[i - 1].categories[0];
        expect(category.localeCompare(prevCategory)).toBeGreaterThanOrEqual(0);
      }
    });

    test('Should sort by creation date', async () => {
      const { body: posts } = await request(process.env.LOCALHOST).get('/posts?order=date');
      expect(posts.length).toBeGreaterThan(1);
      for (let i = 1; i < posts.length; i++) {
        const timestamp = new Date(posts[i].created_at).getTime();
        const prevTimestamp = new Date(posts[i - 1].created_at).getTime();
        expect(timestamp).toBeGreaterThanOrEqual(prevTimestamp);
      }
    });

    test('Should sort by image count', async () => {
      const { body: posts } = await request(process.env.LOCALHOST).get('/posts?order=image-count');
      expect(posts.length).toBeGreaterThan(1);
      for (let i = 1; i < posts.length; i++) {
        expect(posts[i].images.length).toBeLessThanOrEqual(posts[i - 1].images.length);
      }
    });

    test('Should sort by image count desc', async () => {
      const { body: posts } = await request(process.env.LOCALHOST).get(
        '/posts?order=image-count-desc'
      );
      expect(posts.length).toBeGreaterThan(1);
      for (let i = 1; i < posts.length; i++) {
        expect(posts[i].images.length).toBeLessThanOrEqual(posts[i - 1].images.length);
      }
    });

    test('Should sort by image count asc', async () => {
      const { body: posts } = await request(process.env.LOCALHOST).get(
        '/posts?order=image-count-asc'
      );
      expect(posts.length).toBeGreaterThan(1);
      for (let i = 1; i < posts.length; i++) {
        expect(posts[i].images.length).toBeGreaterThanOrEqual(posts[i - 1].images.length);
      }
    });

    test('Should support filtering by a tag', async () => {
      const { body: posts } = await request(process.env.LOCALHOST).get('/posts?tag=2');
      for (const post of posts) {
        expect(post.tags).toContain('Tag 2');
      }
    });

    test('Should support filtering by any tag in a list', async () => {
      const { body: posts } = await request(process.env.LOCALHOST).get('/posts?tags__in=[3,4,5]');
      for (const post of posts) {
        expect(
          post.tags.some((tag: string) => ['Tag 3', 'Tag 4', 'Tag 5'].includes(tag))
        ).toBeTruthy();
      }
    });

    test('Should support filtering by all the tags in a list', async () => {
      const { body: posts } = await request(process.env.LOCALHOST).get('/posts?tags__all=[3,4]');
      for (const post of posts) {
        expect(post.tags).toContain('Tag 3');
        expect(post.tags).toContain('Tag 4');
      }
    });

    test('Should support filtering by title', async () => {
      const { body: posts } = await request(process.env.LOCALHOST).get('/posts?title=about');
      for (const post of posts) {
        expect(post.title).toMatch(/about/gi);
      }
    });
  });
});
