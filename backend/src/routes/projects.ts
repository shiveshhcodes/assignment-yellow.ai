import { FastifyInstance } from 'fastify';
import { ProjectService } from '../services/projectService';
import { authMiddleware } from '../middleware/authMiddleware';
import { createProjectSchema } from '../utils/validators';
export async function projectRoutes(fastify: FastifyInstance) {
  const projectService = new ProjectService();
  fastify.post('/api/projects', {
    preHandler: [authMiddleware],
  }, async (request, reply) => {
    try {
      const validatedData = createProjectSchema.parse(request.body);
      const project = await projectService.createProject(
        request.user!.id,
        validatedData
      );
      return reply.status(201).send({ project });
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });
  fastify.get('/api/projects', {
    preHandler: [authMiddleware],
  }, async (request, reply) => {
    try {
      const projects = await projectService.getUserProjects(request.user!.id);
      return reply.send({ projects });
    } catch (error) {
      return reply.status(500).send({ error: (error as Error).message });
    }
  });
  fastify.get('/api/projects/:id', {
    preHandler: [authMiddleware],
  }, async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const project = await projectService.getProjectById(id, request.user!.id);
      return reply.send({ project });
    } catch (error) {
      return reply.status(404).send({ error: (error as Error).message });
    }
  });
}
