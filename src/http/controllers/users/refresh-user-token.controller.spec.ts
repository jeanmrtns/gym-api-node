import request from 'supertest';
import { app } from '@/app';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Refresh Token controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to refresh a token', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const response = await request(app.server).post('/sessions').send({
      email: 'john@doe.com',
      password: '123456',
    });

    const cookies = response.get('Set-Cookie');

    const refreshTokenResponse = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send();

    expect(refreshTokenResponse.statusCode).toEqual(200);
    expect(refreshTokenResponse.body).toEqual({
      token: expect.any(String),
    });
    expect(refreshTokenResponse.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ]);
  });
});
