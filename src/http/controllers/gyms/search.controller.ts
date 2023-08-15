import { makeSearchGymsService } from '@/services/factories/make-search-gyms.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function searchGymsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchGymsParams = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { q, page } = searchGymsParams.parse(request.query);

  const searchGymsService = makeSearchGymsService();

  const { gyms } = await searchGymsService.execute({
    query: q,
    page,
  });

  return reply.status(200).send({ gyms });
}
