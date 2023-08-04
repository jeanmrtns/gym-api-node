import { expect, describe, it, beforeEach } from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory-database/in-memory.users.repository';
import { GetUserProfileService } from './get-user-profile.service';
import { ResourceNotFoundError } from './errors/resource-not-found.error';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe('Get user profile service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(usersRepository);
  });

  it('should be able get users info by user id', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    });

    const user = await sut.execute(createdUser.id);

    expect(user.name).toBe('John Doe');
  });

  it('should not be able get users info with wrong id', async () => {
    expect(async () => {
      await sut.execute('non-existing-id');
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
