import { FastifyInstance } from 'fastify';
import { registerUserController } from './controllers/register-user.controller';
import { authenticateUserController } from './controllers/authenticate-user.controller';
import { profile } from './controllers/profile.controller';
import { verifyJwtMiddleware } from './middlewares/verify-jwt.middleware';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUserController);
  app.post('/sessions', authenticateUserController);

  app.get('/me', { onRequest: [verifyJwtMiddleware] }, profile);
}
