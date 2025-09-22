import { FastifyInstance } from 'fastify';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema } from '../utils/validators';
export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService();
  fastify.post('/api/auth/register', async (request, reply) => {
    try {
      const validatedData = registerSchema.parse(request.body);
      const result = await authService.register(validatedData);
      return reply.status(201).send(result);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });
  fastify.post('/api/auth/login', async (request, reply) => {
    try {
      const validatedData = loginSchema.parse(request.body);
      const result = await authService.login(validatedData);
      return reply.send(result);
    } catch (error) {
      return reply.status(401).send({ error: (error as Error).message });
    }
  });
}
