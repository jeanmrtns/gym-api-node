import { expect, describe, it, beforeEach } from 'vitest';
import { RegisterUserService } from './register-user.service';
import { InMemoryUsersRepository } from '@/repositories/in-memory-database/in-memory.users.repository';
import { compare } from 'bcryptjs';
import { EmailAlreadyExistsError } from './errors/email-already-exists.error';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUserService;

describe('Register user service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserService(usersRepository);
  });

  it('should be able to create an user', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should hash the password correctly', async () => {
    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    const isPasswordHashedCorrectly = await compare(
      '123456',
      user.password_hash,
    );

    expect(isPasswordHashedCorrectly).toBe(true);
  });

  it('should should not be able to register more users with same email twice', async () => {
    const email = 'johndoe@example.com';
    await sut.execute({
      email,
      name: 'John Doe',
      password: '123456',
    });

    await expect(async () => {
      await sut.execute({
        email,
        name: 'John Doe',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(EmailAlreadyExistsError);
  });
});
