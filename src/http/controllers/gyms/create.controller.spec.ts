import { app } from '@/app';
import request from 'supertest';
import { afterAll, beforeAll, describe, it, expect } from 'vitest';

describe('Create gym controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a new gym', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'john@doe.com',
      password: '123456',
    });

    const { token } = authResponse.body;
    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'My super gym',
        description: 'You can do whatever you want',
        phone: '111111111',
        latitude: -21.8106509,
        longitude: -46.4993994,
      });

    expect(response.statusCode).toEqual(201);
  });
});
