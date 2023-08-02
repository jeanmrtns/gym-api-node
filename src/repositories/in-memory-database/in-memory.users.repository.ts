import type { User } from '@prisma/client';
import { UsersRepository } from '../users.repository';
import { randomUUID } from 'crypto';

export class InMemoryUsersRepository implements UsersRepository {
  users: User[] = [];

  async create(data: User): Promise<User> {
    const user: User = {
      id: randomUUID(),
      email: data.email,
      name: data.name,
      password_hash: data.password_hash,
      created_at: data.created_at,
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    return user || null;
  }
}
