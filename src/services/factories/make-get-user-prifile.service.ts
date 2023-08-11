import { GetUserProfileService } from '../get-user-profile.service';
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';

export function makeGetUserProfileService() {
  const usersRepository = new PrismaUsersRepository();

  const useCase = new GetUserProfileService(usersRepository);

  return useCase;
}
