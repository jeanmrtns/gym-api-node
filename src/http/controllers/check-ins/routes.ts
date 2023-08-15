import { FastifyInstance } from 'fastify';
import { verifyJwtMiddleware } from '../../middlewares/verify-jwt.middleware';
import { createCheckInController } from './create.controller';
import { fetchUserCheckInsHistoryController } from './history.controller';
import { getUserCheckInsMetricsController } from './metrics.controller';
import { validateCheckInController } from './validate.controller';

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwtMiddleware);

  app.post('/check-ins/:gymId', createCheckInController);
  app.get('/check-ins/history', fetchUserCheckInsHistoryController);
  app.get('/check-ins/metrics', getUserCheckInsMetricsController);
  app.patch('/check-ins/:checkInId', validateCheckInController);
}
