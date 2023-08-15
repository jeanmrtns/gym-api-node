import { makeFetchUserCheckInsHistoryService } from '@/services/factories/make-fetch-user-check-ins-history.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function fetchUserCheckInsHistoryController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const fetchUserCheckInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = fetchUserCheckInHistoryQuerySchema.parse(request.query);

  const fetchUserCheckInsHistoryService = makeFetchUserCheckInsHistoryService();

  const { checkIns } = await fetchUserCheckInsHistoryService.execute({
    userId: request.user.sub,
    page,
  });

  return reply.status(200).send({ checkIns });
}
