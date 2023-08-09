import { CheckInsRepository } from '@/repositories/check-ins.repository';
import { ResourceNotFoundError } from './errors/resource-not-found.error';
import dayjs from 'dayjs';
import { InvalidTimeToCheckInError } from './errors/invalid-time-to-check-in.error';

interface ValidateCheckInServiceRequest {
  checkInId: string;
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({ checkInId }: ValidateCheckInServiceRequest) {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new InvalidTimeToCheckInError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return { checkIn };
  }
}
