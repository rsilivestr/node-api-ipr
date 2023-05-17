import { beforeAll, describe, expect, test } from '@jest/globals';
import request from 'supertest';

import { UserController } from './controller';

const baseUrl = 'http://localhost:3000/api/v1';

describe('User controller', () => {
  test('findOne', async () => {
    const response = await request(baseUrl).get(`/users/1`);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(1);
  });
});
