import { InMemoryGymsRepository } from '@/repositories/in-memory-database/in-memory.gyms.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchNearbyGymsService } from './fetch-nearby-gyms.service';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsService;

describe('Search gyms service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsService(gymsRepository);
  });

  it('should be able to search gyms', async () => {
    await gymsRepository.create({
      name: 'Nearby Gym',
      description: null,
      phone: '1111111111',
      latitude: -21.8106509,
      longitude: -46.4993994,
    });

    await gymsRepository.create({
      name: 'TS Gym',
      description: null,
      phone: '1111111111',
      latitude: -20.8106509,
      longitude: -46.4993994,
    });

    const { gyms } = await sut.execute({
      userLatitude: -21.8106509,
      userLongitude: -46.4993994,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ name: 'Nearby Gym' })]);
  });
});
