import { app } from '@/app';
import { prisma } from '@/infra/database/prisma';
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, it, expect } from 'vitest';

describe('Create check-in controller', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        name: 'My super gym',
        description: 'You can do whatever you want',
        phone: '111111111',
        latitude: -21.8106509,
        longitude: -46.4993994,
      },
    });

    const response = await request(app.server)
      .post(`/check-ins/${gym.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -21.8106509,
        longitude: -46.4993994,
      });

    expect(response.statusCode).toEqual(201);

    const user = await prisma.user.findFirstOrThrow();
    expect(response.body.checkIn).toEqual(
      expect.objectContaining({
        user_id: user.id,
        gym_id: gym.id,
      }),
    );
  });
});
