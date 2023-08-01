interface User {
  name: string;
  email: string;
  password_hash: string;
}

export interface UsersRepository {
  create(data: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
