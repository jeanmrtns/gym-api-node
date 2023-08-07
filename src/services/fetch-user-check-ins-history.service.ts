import { CheckInsRepository } from '@/repositories/check-ins.repository';

interface FetchUserCheckInsHistoryServiceRequest {
  userId: string;
  page: number;
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId, page }: FetchUserCheckInsHistoryServiceRequest) {
    const checkIns = await this.checkInsRepository.findAllByUserId(
      userId,
      page,
    );

    return { checkIns };
  }
}
