import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, it, expect } from 'vitest';

describe('Search gym controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to search gyms by name', async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'My super gym',
        description: 'You can do whatever you want',
        phone: '111111111',
        latitude: -21.8106509,
        longitude: -46.4993994,
      });

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'My super Javascript Gym',
        description: 'You can do whatever you want',
        phone: '111111111',
        latitude: -21.8106509,
        longitude: -46.4993994,
      });

    const response = await request(app.server)
      .get('/gyms/search')
      .set('Authorization', `Bearer ${token}`)
      .query({
        q: 'Javascript',
      })
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: 'My super Javascript Gym',
      }),
    ]);
  });
});
