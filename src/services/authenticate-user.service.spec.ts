import { expect, describe, it } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory-database/in-memory.users.repository';
import { AuthenticateUserService } from './authenticate-user.service';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';

describe('Authenticate user service', () => {
  it('should be able to authenticate an user', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUserService(usersRepository); // SUT = System under tests

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to authenticate an user with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUserService(usersRepository);

    expect(async () => {
      await sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate an user with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository();
    const sut = new AuthenticateUserService(usersRepository);
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    });

    expect(async () => {
      await sut.execute({
        email: 'johndoe@example.com',
        password: '1234567',
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
