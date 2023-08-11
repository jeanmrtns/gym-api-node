import { ValidateCheckInService } from '../validate-check-in.service';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins.repository';

export function makeValidateCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository();

  const useCase = new ValidateCheckInService(checkInsRepository);

  return useCase;
}
