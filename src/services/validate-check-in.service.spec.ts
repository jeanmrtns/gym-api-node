import { InMemoryCheckInsRepository } from '@/repositories/in-memory-database/in-memory.check-ins.repository';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ValidateCheckInService } from './validate-check-in.service';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import { InvalidTimeToCheckInError } from './errors/invalid-time-to-check-in.error';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInService;

describe('Validate Check-in service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInService(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate one check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-id',
      user_id: 'user-id',
    });

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.checkIns[0].validated_at).toEqual(
      expect.any(Date),
    );
  });

  it('should not be able to validate a check-in that does not exists', async () => {
    await expect(async () => {
      await sut.execute({
        checkInId: 'inexistent-check-in',
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate a check-in if it was created more than 20 minutes ago', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 14, 0));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-id',
      user_id: 'user-id',
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(async () => {
      await sut.execute({
        checkInId: createdCheckIn.id,
      });
    }).rejects.toBeInstanceOf(InvalidTimeToCheckInError);
  });
});
