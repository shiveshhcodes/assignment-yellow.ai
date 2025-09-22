import { prisma } from '../db/prismaClient';
import { CreatePromptData } from '../utils/validators';
export interface Prompt {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  projectId: string;
}
export class PromptService {
  async createPrompt(projectId: string, data: CreatePromptData): Promise<Prompt> {
    const prompt = await prisma.prompt.create({
      data: {
        projectId,
        title: data.title,
        content: data.content,
      },
    });
    return prompt;
  }
  async getProjectPrompts(projectId: string): Promise<Prompt[]> {
    const prompts = await prisma.prompt.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
    return prompts;
  }
  async getPromptById(promptId: string): Promise<Prompt> {
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
    });
    if (!prompt) {
      throw new Error('Prompt not found');
    }
    return prompt;
  }
  async deletePrompt(promptId: string): Promise<void> {
    await prisma.prompt.delete({
      where: { id: promptId },
    });
  }
}
