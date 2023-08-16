import { FastifyInstance } from 'fastify';
import { verifyJwtMiddleware } from '../../middlewares/verify-jwt.middleware';
import { createGymController } from './create.controller';
import { searchGymsController } from './search.controller';
import { searchNearbyGymsController } from './nearby.controller';
import { verifyUserRoleMiddleware } from '@/http/middlewares/verify-user-role.middleware';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwtMiddleware);

  app.get('/gyms/search', searchGymsController);
  app.get('/gyms/nearby', searchNearbyGymsController);
  app.post(
    '/gyms',
    { onRequest: [verifyUserRoleMiddleware('ADMIN')] },
    createGymController,
  );
}
