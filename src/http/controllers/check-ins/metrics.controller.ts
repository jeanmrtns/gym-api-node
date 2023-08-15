import { makeGetUserCheckInsMetricsService } from '@/services/factories/make-get-user-check-ins-metrics.service';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getUserCheckInsMetricsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserCheckInsMetricsService = makeGetUserCheckInsMetricsService();

  const { checkInsCount } = await getUserCheckInsMetricsService.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({ checkInsCount });
}
