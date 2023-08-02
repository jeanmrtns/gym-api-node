import { expect, describe, it } from 'vitest';
import { RegisterUserService } from './register-user.service';
import { InMemoryUsersRepository } from '@/repositories/in-memory-database/in-memory.users.repository';
import { compare } from 'bcryptjs';
import { EmailAlreadyExistsError } from './errors/email-already-exists.error';

describe('Register user service', () => {
  it('should be able to create an user', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserService = new RegisterUserService(usersRepository);

    const { user } = await registerUserService.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should hash the password correctly', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUserService = new RegisterUserService(usersRepository);

    const { user } = await registerUserService.execute({
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
    const usersRepository = new InMemoryUsersRepository();
    const registerUserService = new RegisterUserService(usersRepository);

    const email = 'johndoe@example.com';
    await registerUserService.execute({
      email,
      name: 'John Doe',
      password: '123456',
    });

    expect(async () => {
      await registerUserService.execute({
        email,
        name: 'John Doe',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(EmailAlreadyExistsError);
  });
});
