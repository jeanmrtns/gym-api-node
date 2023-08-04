import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { CheckInService } from './check-in.service';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory-database/in-memory.check-ins.repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory-database/in-memory.gyms.repository';
import { Decimal } from '@prisma/client/runtime/library';
import { ResourceNotFoundError } from './errors/resource-not-found.error';

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
      latitude: new Decimal(0),
      longitude: new Decimal(0),
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
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn).toHaveProperty('id');
  });

  it('should not be able to check in with wrong gym id', async () => {
    await expect(async () => {
      await sut.execute({
        gymId: 'gym-id-wrong',
        userId: 'user-id',
        userLatitude: 0,
        userLongitude: 0,
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 2, 10, 13, 0, 0));

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(async () => {
      await sut.execute({
        gymId: 'gym-id',
        userId: 'user-id',
        userLatitude: 0,
        userLongitude: 0,
      });
    }).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in twice but in differente days', async () => {
    vi.setSystemTime(new Date(2023, 2, 10, 13, 0, 0));

    await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2023, 2, 11, 13, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn).toHaveProperty('id');
  });
});