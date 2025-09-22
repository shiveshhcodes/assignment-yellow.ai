import { FastifyInstance } from 'fastify';
import { UserService } from '../services/userService';
import { authMiddleware } from '../middleware/authMiddleware';
export async function userRoutes(fastify: FastifyInstance) {
  const userService = new UserService();
  fastify.get('/api/me', {
    preHandler: [authMiddleware],
  }, async (request, reply) => {
    try {
      const user = await userService.getUserProfile(request.user!.id);
      return reply.send({ user });
    } catch (error) {
      return reply.status(404).send({ error: (error as Error).message });
    }
  });
  fastify.patch('/api/me', {
    preHandler: [authMiddleware],
  }, async (request, reply) => {
    try {
      const user = await userService.updateUserProfile(
        request.user!.id,
        request.body as any
      );
      return reply.send({ user });
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });
}
