import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory-database/in-memory.gyms.repository';
import { CreateGymService } from './create-gym.service';

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe('Register user service', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(gymsRepository);
  });

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      name: 'JS Gym',
      description: null,
      latitude: -21.8106509,
      longitude: -46.4993994,
    });

    expect(gym).toHaveProperty('id');
  });
});
