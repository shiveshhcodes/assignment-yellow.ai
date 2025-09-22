import { prisma } from '../db/prismaClient';
import { createProviderAdapter, ChatMessage } from './providerAdapter';
import { ProjectService } from './projectService';
import { PromptService } from './promptService';
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
  projectId: string;
}
export interface ChatResponse {
  message: string;
  messageId: string;
}
export class ChatService {
  private providerAdapter = createProviderAdapter();
  private projectService = new ProjectService();
  private promptService = new PromptService();
  async sendMessage(projectId: string, userId: string, userMessage: string): Promise<ChatResponse> {
    const hasAccess = await this.projectService.verifyProjectOwnership(projectId, userId);
    if (!hasAccess) {
      throw new Error('Project not found or access denied');
    }
    const userMessageRecord = await prisma.message.create({
      data: {
        projectId,
        role: 'user',
        content: userMessage,
      },
    });
    try {
      const messages = await this.buildConversationContext(projectId);
      messages.push({
        role: 'user',
        content: userMessage,
      });
      const response = await this.providerAdapter.createChatCompletion(messages);
      const assistantMessageRecord = await prisma.message.create({
        data: {
          projectId,
          role: 'assistant',
          content: response.message,
        },
      });
      return {
        message: response.message,
        messageId: assistantMessageRecord.id,
      };
    } catch (error) {
      console.error('Error in chat service:', error);
      throw new Error('Failed to generate response');
    }
  }
  async getProjectMessages(projectId: string, userId: string, limit = 50): Promise<Message[]> {
    const hasAccess = await this.projectService.verifyProjectOwnership(projectId, userId);
    if (!hasAccess) {
      throw new Error('Project not found or access denied');
    }
    const messages = await prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return messages.reverse();
  }
  private async buildConversationContext(projectId: string): Promise<ChatMessage[]> {
    const messages: ChatMessage[] = [];
    const prompts = await this.promptService.getProjectPrompts(projectId);
    if (prompts.length > 0) {
      const systemContent = prompts
        .map(p => `${p.title}: ${p.content}`)
        .join('\n\n');
      messages.push({
        role: 'system',
        content: systemContent,
      });
    }
    const recentMessages = await prisma.message.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    recentMessages.reverse().forEach(msg => {
      if (msg.role !== 'system') {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        });
      }
    });
    return messages;
  }
}
