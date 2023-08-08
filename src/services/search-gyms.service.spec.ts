import { InMemoryGymsRepository } from '@/repositories/in-memory-database/in-memory.gyms.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { SearchGymsService } from './search-gyms.service';

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymsService;

describe('Search gyms service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsService(gymsRepository);
  });

  it('should be able to search gyms', async () => {
    await gymsRepository.create({
      name: 'JS Gym',
      description: null,
      phone: '1111111111',
      latitude: -21.8106509,
      longitude: -46.4993994,
    });

    await gymsRepository.create({
      name: 'TS Gym',
      description: null,
      phone: '1111111111',
      latitude: -21.8106509,
      longitude: -46.4993994,
    });

    const { gyms } = await sut.execute({ query: 'TS', page: 1 });

    expect(gyms).toHaveLength(1);
  });

  it('should be able to search gyms with pagination', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        name: `JS Gym ${i}`,
        description: null,
        phone: '1111111111',
        latitude: -21.8106509,
        longitude: -46.4993994,
      });
    }

    const { gyms } = await sut.execute({ query: 'JS', page: 2 });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'JS Gym 21' }),
      expect.objectContaining({ name: 'JS Gym 22' }),
    ]);
  });
});
