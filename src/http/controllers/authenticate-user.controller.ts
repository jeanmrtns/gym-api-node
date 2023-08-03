import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users.repository';
import { AuthenticateUserService } from '@/services/authenticate-user.service';
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials.error';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function authenticateUserController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateUserSchema.parse(request.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const authenticateUserService = new AuthenticateUserService(
      usersRepository,
    );
    await authenticateUserService.execute({ email, password });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({
        message: error.message,
      });
    }

    throw error;
  }

  return reply.status(200).send();
}
