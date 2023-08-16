import { FastifyInstance } from 'fastify';
import { registerUserController } from './register-user.controller';
import { authenticateUserController } from './authenticate-user.controller';
import { profile } from './profile.controller';
import { verifyJwtMiddleware } from '../../middlewares/verify-jwt.middleware';
import { refreshUserTokenController } from './refresh-user-token.controller';

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', registerUserController);
  app.post('/sessions', authenticateUserController);

  app.patch('/token/refresh', refreshUserTokenController);

  app.get('/me', { onRequest: [verifyJwtMiddleware] }, profile);
}
