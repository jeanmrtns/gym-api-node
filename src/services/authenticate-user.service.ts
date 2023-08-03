import { UsersRepository } from '@/repositories/users.repository';
import { User } from '@prisma/client';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';
import { compare } from 'bcryptjs';

interface AuthenticateUserServiceRequest {
  email: string;
  password: string;
}

interface AuthenticateUserServiceResponse {
  user: User;
}

export class AuthenticateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserServiceRequest): Promise<AuthenticateUserServiceResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, user.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      user,
    };
  }
}
