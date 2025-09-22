import { FastifyInstance } from 'fastify';
import { ChatService } from '../services/chatService';
import { authMiddleware } from '../middleware/authMiddleware';
import { chatMessageSchema } from '../utils/validators';
export async function chatRoutes(fastify: FastifyInstance) {
  const chatService = new ChatService();
  fastify.post('/api/projects/:projectId/chat', {
    preHandler: [authMiddleware],
  }, async (request, reply) => {
    try {
      const { projectId } = request.params as { projectId: string };
      const validatedData = chatMessageSchema.parse(request.body);
      const { message } = validatedData;
      const response = await chatService.sendMessage(
        projectId,
        request.user!.id,
        message
      );
      return reply.send(response);
    } catch (error) {
      if ((error as Error).message.includes('not found') || 
          (error as Error).message.includes('access denied')) {
        return reply.status(404).send({ error: (error as Error).message });
      }
      return reply.status(500).send({ error: (error as Error).message });
    }
  });
  fastify.get('/api/projects/:projectId/messages', {
    preHandler: [authMiddleware],
  }, async (request, reply) => {
    try {
      const { projectId } = request.params as { projectId: string };
      const { limit } = request.query as { limit?: number };
      const messages = await chatService.getProjectMessages(
        projectId,
        request.user!.id,
        limit
      );
      return reply.send({ messages });
    } catch (error) {
      if ((error as Error).message.includes('not found') || 
          (error as Error).message.includes('access denied')) {
        return reply.status(404).send({ error: (error as Error).message });
      }
      return reply.status(500).send({ error: (error as Error).message });
    }
  });
}
