import { InMemoryCheckInsRepository } from '@/repositories/in-memory-database/in-memory.check-ins.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserCheckInsMetricsService } from './get-user-check-ins-metrics.service';

let checkInsRepository: InMemoryCheckInsRepository;
let getUserCheckInsMetricsService: GetUserCheckInsMetricsService;

describe('Get User Check-Ins Metrics Service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    getUserCheckInsMetricsService = new GetUserCheckInsMetricsService(
      checkInsRepository,
    );
  });

  it('should be able to return the count of check-ins by user Id', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-id',
      user_id: 'user-id',
    });

    await checkInsRepository.create({
      gym_id: 'gym-id2',
      user_id: 'user-id',
    });

    const { checkInsCount } = await getUserCheckInsMetricsService.execute({
      userId: 'user-id',
    });

    expect(checkInsCount).toEqual(2);
  });
});
