import { CheckInsRepository } from '@/repositories/check-ins.repository';

interface GetUserCheckInsMetricsServiceRequest {
  userId: string;
}

interface GetUserCheckInsMetricsServiceResponse {
  checkInsCount: number;
}

export class GetUserCheckInsMetricsService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserCheckInsMetricsServiceRequest): Promise<GetUserCheckInsMetricsServiceResponse> {
    const checkInsCount = await this.checkInsRepository.getMetricsByUserId(
      userId,
    );

    return { checkInsCount };
  }
}
