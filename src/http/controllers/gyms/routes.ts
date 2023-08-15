import { FastifyInstance } from 'fastify';
import { verifyJwtMiddleware } from '../../middlewares/verify-jwt.middleware';
import { createGymController } from './create.controller';
import { searchGymsController } from './search.controller';
import { searchNearbyGymsController } from './nearby.controller';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwtMiddleware);

  app.get('/gyms/search', searchGymsController);
  app.get('/gyms/nearby', searchNearbyGymsController);
  app.post('/gyms', createGymController);
}
