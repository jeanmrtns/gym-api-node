import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins.repository';
import { GetUserCheckInsMetricsService } from '../get-user-check-ins-metrics.service';

export function makeGetUserCheckInsMetricsService() {
  const checkInsRepository = new PrismaCheckInsRepository();

  const useCase = new GetUserCheckInsMetricsService(checkInsRepository);

  return useCase;
}
