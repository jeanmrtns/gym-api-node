import { prisma } from '@/infra/database/prisma';
import { hash } from 'bcryptjs';

interface RegisterUserServiceRequest {
  email: string;
  name: string;
  password: string;
}

export async function registerUserService({
  email,
  name,
  password,
}: RegisterUserServiceRequest) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userWithSameEmail) {
    throw new Error('E-mail already registered');
  }

  const passwordHash = await hash(password, 6);

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
  });
}
