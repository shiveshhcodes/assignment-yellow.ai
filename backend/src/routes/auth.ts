import { FastifyInstance } from 'fastify';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema } from '../utils/validators';
export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService();
  fastify.post('/api/auth/register', async (request, reply) => {
    try {
      console.log('Registration request body:', request.body);
      const validatedData = registerSchema.parse(request.body);
      console.log('Validated data:', validatedData);
      const result = await authService.register(validatedData);
      return reply.status(201).send(result);
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
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
