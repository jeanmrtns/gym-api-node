import { makeGetUserProfileService } from '@/services/factories/make-get-user-prifile.service';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileService();

  const user = await getUserProfile.execute(request.user.sub);

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  });
}
