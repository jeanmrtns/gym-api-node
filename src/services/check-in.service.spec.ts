import { expect, describe, it, beforeEach } from 'vitest';
import { CheckInService } from './check-in.service';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory-database/in-memory.check-ins.repository';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInService;

describe('Authenticate user service', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInService(checkInsRepository);
  });

  it('should be able to authenticate an user', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id',
      userId: 'user-id',
    });

    expect(checkIn).toHaveProperty('id');
  });
});
