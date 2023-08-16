import '@fastify/jwt';

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      role: 'MEMBER' | 'ADMIN';
      sub: string;
    };
  }
}
