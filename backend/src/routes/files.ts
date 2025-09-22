import { FastifyInstance } from 'fastify';
import { FileService } from '../services/fileService';
import { authMiddleware } from '../middleware/authMiddleware';
export async function fileRoutes(fastify: FastifyInstance) {
  const fileService = new FileService();
  fastify.post('/api/projects/:projectId/files', {
    preHandler: [authMiddleware],
  }, async (request, reply) => {
    try {
      const { projectId } = request.params as { projectId: string };
      const data = await request.file();
      if (!data) {
        return reply.status(400).send({ error: 'No file provided' });
      }
      const fileBuffer = await data.toBuffer();
      const filename = data.filename;
      const mimeType = data.mimetype;
      if (!filename) {
        return reply.status(400).send({ error: 'Filename is required' });
      }
      const result = await fileService.uploadFile(
        projectId,
        request.user!.id,
        filename,
        fileBuffer,
        mimeType
      );
      return reply.status(201).send(result);
    } catch (error) {
      if ((error as Error).message.includes('not found') || 
          (error as Error).message.includes('access denied')) {
        return reply.status(404).send({ error: (error as Error).message });
      }
      return reply.status(500).send({ error: (error as Error).message });
    }
  });
  fastify.get('/api/projects/:projectId/files', {
    preHandler: [authMiddleware],
  }, async (request, reply) => {
    try {
      const { projectId } = request.params as { projectId: string };
      const files = await fileService.getProjectFiles(
        projectId,
        request.user!.userId
      );
      return reply.send({ files });
    } catch (error) {
      if ((error as Error).message.includes('not found') || 
          (error as Error).message.includes('access denied')) {
        return reply.status(404).send({ error: (error as Error).message });
      }
      return reply.status(500).send({ error: (error as Error).message });
    }
  });
  fastify.delete('/api/files/:fileId', {
    preHandler: [authMiddleware],
  }, async (request, reply) => {
    try {
      const { fileId } = request.params as { fileId: string };
      await fileService.deleteFile(fileId, request.user!.id);
      return reply.status(204).send();
    } catch (error) {
      if ((error as Error).message.includes('not found') || 
          (error as Error).message.includes('access denied')) {
        return reply.status(404).send({ error: (error as Error).message });
      }
      return reply.status(500).send({ error: (error as Error).message });
    }
  });
}
