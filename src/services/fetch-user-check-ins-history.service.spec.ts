import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory-database/in-memory.check-ins.repository';
import { FetchUserCheckInsHistoryService } from './fetch-user-check-ins-history.service';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryService;

describe('Fetch User Check-ins History service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistoryService(checkInsRepository);
  });

  it('should be able to fetch the check-ins history', async () => {
    await checkInsRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id',
    });

    await checkInsRepository.create({
      user_id: 'user-id',
      gym_id: 'gym-id2',
    });

    const { checkIns } = await sut.execute({
      userId: 'user-id',
      page: 1,
    });

    expect(checkIns).toHaveLength(2);

    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-id' }),
      expect.objectContaining({ gym_id: 'gym-id2' }),
    ]);
  });
});
