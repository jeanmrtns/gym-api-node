import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { CheckInService } from './check-in.service';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory-database/in-memory.check-ins.repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory-database/in-memory.gyms.repository';
import { Decimal } from '@prisma/client/runtime/library';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import { MaxDistanceError } from './errors/max-distance.error';
import { MaxCheckInsError } from './errors/max-check-ins.error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe('CheckIn service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInService(checkInsRepository, gymsRepository);

    gymsRepository.gyms.push({
      id: 'gym-id',
      name: 'Super gym',
      description: '',
      latitude: new Decimal(-21.8106509),
      longitude: new Decimal(-46.4993994),
      created_at: new Date(),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -21.8106509,
      userLongitude: -46.4993994,
    });

    expect(checkIn).toHaveProperty('id');
  });

  it('should not be able to check in with wrong gym id', async () => {
    await expect(async () => {
      await sut.execute({
        gymId: 'gym-id-wrong',
        userId: 'user-id',
        userLatitude: -21.8106509,
        userLongitude: -46.4993994,
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to check in if user is not close to the gym', async () => {
    await expect(async () => {
      await sut.execute({
        gymId: 'gym-id',
        userId: 'user-id',
        userLatitude: -21.8065755,
        userLongitude: -46.4995082,
      });
    }).rejects.toBeInstanceOf(MaxDistanceError);
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 2, 10, 13, 0, 0));

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -21.8106509,
      userLongitude: -46.4993994,
    });

    await expect(async () => {
      await sut.execute({
        gymId: 'gym-id',
        userId: 'user-id',
        userLatitude: -21.8106509,
        userLongitude: -46.4993994,
      });
    }).rejects.toBeInstanceOf(MaxCheckInsError);
  });

  it('should be able to check in twice but in differente days', async () => {
    vi.setSystemTime(new Date(2023, 2, 10, 13, 0, 0));

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -21.8106509,
      userLongitude: -46.4993994,
    });

    vi.setSystemTime(new Date(2023, 2, 11, 13, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: -21.8106509,
      userLongitude: -46.4993994,
    });

    expect(checkIn).toHaveProperty('id');
  });
});
