import { GymsRepository } from '@/repositories/gyms-repository';

interface CreateGymServiceRequest {
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
}

export class CreateGymService {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    name,
    description,
    latitude,
    longitude,
  }: CreateGymServiceRequest) {
    const gym = await this.gymsRepository.create({
      name,
      description,
      latitude,
      longitude,
    });

    return { gym };
  }
}
