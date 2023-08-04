import { UsersRepository } from '@/repositories/users.repository';
import { ResourceNotFoundError } from './errors/resource-not-found.error';

export class GetUserProfileService {
  constructor(private usersRepository: UsersRepository) {}

  async execute(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return user;
  }
}
