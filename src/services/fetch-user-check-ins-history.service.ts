import { CheckInsRepository } from '@/repositories/check-ins.repository';

interface FetchUserCheckInsHistoryServiceRequest {
  userId: string;
}

export class FetchUserCheckInsHistoryService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ userId }: FetchUserCheckInsHistoryServiceRequest) {
    const checkIns = await this.checkInsRepository.findAllByUserId(userId);

    return { checkIns };
  }
}
