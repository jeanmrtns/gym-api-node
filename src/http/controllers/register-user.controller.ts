import { prisma } from '@/infra/database/prisma';
import { hash } from 'bcryptjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function registerUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerUserSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerUserSchema.parse(request.body);

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userWithSameEmail) {
    return reply.status(409).send();
  }

  const passwordHash = await hash(password, 6);

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: passwordHash,
    },
  });

  return reply.status(201).send();
}
