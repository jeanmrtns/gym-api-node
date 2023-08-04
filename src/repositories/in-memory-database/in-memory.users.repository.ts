import type { User, Prisma } from '@prisma/client';
import { UsersRepository } from '../users.repository';
import { randomUUID } from 'crypto';

export class InMemoryUsersRepository implements UsersRepository {
  users: User[] = [];

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      email: data.email,
      name: data.name,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((user) => user.email === email);

    return user || null;
  }

  async findById(id: string) {
    const user = this.users.find((user) => user.id === id);

    return user || null;
  }
}
