import { FastifyInstance } from 'fastify';
import { registerUserController } from './controllers/register-user.controller';
import { authenticateUserController } from './controllers/authenticate-user.controller';

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUserController);

  app.post('/sessions', authenticateUserController);
}
