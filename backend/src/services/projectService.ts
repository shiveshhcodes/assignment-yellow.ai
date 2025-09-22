import { prisma } from '../db/prismaClient';
import { CreateProjectData } from '../utils/validators';
export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  userId: string;
}
export interface ProjectWithCounts extends Project {
  _count: {
    prompts: number;
    messages: number;
    files: number;
  };
}
export class ProjectService {
  async createProject(userId: string, data: CreateProjectData): Promise<Project> {
    const project = await prisma.project.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
      },
    });
    return project;
  }
  async getUserProjects(userId: string): Promise<ProjectWithCounts[]> {
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            prompts: true,
            messages: true,
            files: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return projects;
  }
  async getProjectById(projectId: string, userId: string): Promise<ProjectWithCounts> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
      include: {
        _count: {
          select: {
            prompts: true,
            messages: true,
            files: true,
          },
        },
      },
    });
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }
  async verifyProjectOwnership(projectId: string, userId: string): Promise<boolean> {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });
    return !!project;
  }
}
