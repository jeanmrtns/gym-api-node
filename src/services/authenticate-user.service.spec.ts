import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory-database/in-memory.users.repository';
import { AuthenticateUserService } from './authenticate-user.service';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUserService;

describe('Authenticate user service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUserService(usersRepository);
  });

  it('should be able to authenticate an user', async () => {
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
    expect(async () => {
      await sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate an user with wrong password', async () => {
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
