import { UsersRepository } from '@/repositories/users.repository';
import { hash } from 'bcryptjs';
import { EmailAlreadyExistsError } from './errors/email-already-exists.error';

interface RegisterUserServiceRequest {
  email: string;
  name: string;
  password: string;
}

export class RegisterUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterUserServiceRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash = await hash(password, 6);

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    });
  }
}
