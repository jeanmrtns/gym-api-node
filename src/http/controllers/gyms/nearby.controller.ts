import { makeFetchNearbyGymsService } from '@/services/factories/make-fetch-nearby-gyms.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function searchNearbyGymsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const searchNearbyGymsParams = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = searchNearbyGymsParams.parse(request.query);

  const fetchNearbyGymsService = makeFetchNearbyGymsService();

  const { gyms } = await fetchNearbyGymsService.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return reply.status(200).send({ gyms });
}
