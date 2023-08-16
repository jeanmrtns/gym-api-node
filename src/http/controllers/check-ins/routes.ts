import { FastifyInstance } from 'fastify';
import { verifyJwtMiddleware } from '../../middlewares/verify-jwt.middleware';
import { createCheckInController } from './create.controller';
import { fetchUserCheckInsHistoryController } from './history.controller';
import { getUserCheckInsMetricsController } from './metrics.controller';
import { validateCheckInController } from './validate.controller';
import { verifyUserRoleMiddleware } from '@/http/middlewares/verify-user-role.middleware';

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwtMiddleware);

  app.post('/check-ins/:gymId', createCheckInController);
  app.get('/check-ins/history', fetchUserCheckInsHistoryController);
  app.get('/check-ins/metrics', getUserCheckInsMetricsController);
  app.patch(
    '/check-ins/:checkInId',
    { onRequest: [verifyUserRoleMiddleware('ADMIN')] },
    validateCheckInController,
  );
}
