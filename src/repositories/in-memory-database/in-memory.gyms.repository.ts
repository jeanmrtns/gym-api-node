import { Gym, Prisma } from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { randomUUID } from 'crypto';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements GymsRepository {
  gyms: Gym[] = [];

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id);

    return gym || null;
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      );

      return distance < 10;
    });
  }

  async searchMany(query: string, page: number) {
    return this.gyms
      .filter((gym) => gym.name.includes(query))
      .slice((page - 1) * 20, page * 20);
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      phone: data.phone ?? null,
      description: data.description ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    };

    this.gyms.push(gym);

    return gym;
  }
}
