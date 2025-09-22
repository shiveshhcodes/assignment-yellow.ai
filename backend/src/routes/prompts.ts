import { FastifyInstance } from 'fastify';
import { PromptService } from '../services/promptService';
import { ProjectService } from '../services/projectService';
import { authMiddleware } from '../middleware/authMiddleware';
import { createPromptSchema } from '../utils/validators';
export async function promptRoutes(fastify: FastifyInstance) {
  const promptService = new PromptService();
  const projectService = new ProjectService();
  fastify.post('/api/projects/:projectId/prompts', {
    preHandler: [authMiddleware],
  }, async (request, reply) => {
    try {
      const { projectId } = request.params as { projectId: string };
      const hasAccess = await projectService.verifyProjectOwnership(
        projectId,
        request.user!.id
      );
      if (!hasAccess) {
        return reply.status(404).send({ error: 'Project not found' });
      }
      const validatedData = createPromptSchema.parse(request.body);
      const prompt = await promptService.createPrompt(
        projectId,
        validatedData
      );
      return reply.status(201).send({ prompt });
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });
  fastify.get('/api/projects/:projectId/prompts', {
    preHandler: [authMiddleware],
  }, async (request, reply) => {
    try {
      const { projectId } = request.params as { projectId: string };
      const hasAccess = await projectService.verifyProjectOwnership(
        projectId,
        request.user!.id
      );
      if (!hasAccess) {
        return reply.status(404).send({ error: 'Project not found' });
      }
      const prompts = await promptService.getProjectPrompts(projectId);
      return reply.send({ prompts });
    } catch (error) {
      return reply.status(500).send({ error: (error as Error).message });
    }
  });
  fastify.delete('/api/prompts/:promptId', {
    preHandler: [authMiddleware],
  }, async (request, reply) => {
    try {
      const { promptId } = request.params as { promptId: string };
      const prompt = await promptService.getPromptById(promptId);
      const hasAccess = await projectService.verifyProjectOwnership(
        prompt.projectId,
        request.user!.id
      );
      if (!hasAccess) {
        return reply.status(404).send({ error: 'Prompt not found' });
      }
      await promptService.deletePrompt(promptId);
      return reply.status(204).send();
    } catch (error) {
      return reply.status(404).send({ error: (error as Error).message });
    }
  });
}
