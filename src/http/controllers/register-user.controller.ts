import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';
import { RegisterUserService } from '@/services/register-user.service';
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

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUserService = new RegisterUserService(usersRepository);
    await registerUserService.execute({ name, email, password });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send();
}
