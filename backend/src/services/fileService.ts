import { prisma } from '../db/prismaClient';
import { ProjectService } from './projectService';
export interface FileRecord {
  id: string;
  filename: string;
  storageUrl: string;
  providerFileId: string | null;
  createdAt: Date;
  projectId: string;
}
export interface FileUploadResult {
  file: FileRecord;
  providerFileId?: string;
}
export class FileService {
  private projectService = new ProjectService();
  async uploadFile(
    projectId: string,
    userId: string,
    filename: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<FileUploadResult> {
    const hasAccess = await this.projectService.verifyProjectOwnership(projectId, userId);
    if (!hasAccess) {
      throw new Error('Project not found or access denied');
    }
    try {
      let providerFileId: string | undefined;
      if (process.env.OPENAI_API_KEY) {
        try {
          providerFileId = await this.uploadToOpenAI(filename, fileBuffer, mimeType);
        } catch (error) {
          console.warn('Failed to upload to OpenAI Files API:', error);
        }
      }
      const storageUrl = `uploads/${projectId}/${Date.now()}-${filename}`;
      const fileRecord = await prisma.file.create({
        data: {
          projectId,
          filename,
          storageUrl,
          providerFileId,
        },
      });
      return {
        file: fileRecord,
        providerFileId,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }
  async getProjectFiles(projectId: string, userId: string): Promise<FileRecord[]> {
    const hasAccess = await this.projectService.verifyProjectOwnership(projectId, userId);
    if (!hasAccess) {
      throw new Error('Project not found or access denied');
    }
    const files = await prisma.file.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
    return files;
  }
  async deleteFile(fileId: string, userId: string): Promise<void> {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: { project: true },
    });
    if (!file) {
      throw new Error('File not found');
    }
    const hasAccess = await this.projectService.verifyProjectOwnership(file.projectId, userId);
    if (!hasAccess) {
      throw new Error('Access denied');
    }
    if (file.providerFileId && process.env.OPENAI_API_KEY) {
      try {
        await this.deleteFromOpenAI(file.providerFileId);
      } catch (error) {
        console.warn('Failed to delete from OpenAI Files API:', error);
      }
    }
    await prisma.file.delete({
      where: { id: fileId },
    });
  }
  private async uploadToOpenAI(filename: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
    const formData = new FormData();
    const blob = new Blob([fileBuffer], { type: mimeType });
    formData.append('file', blob, filename);
    formData.append('purpose', 'assistants');
    const response = await fetch('https://api.openai.com/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI Files API error: ${response.status} ${error}`);
    }
    const data = await response.json() as { id: string };
    return data.id;
  }
  private async deleteFromOpenAI(fileId: string): Promise<void> {
    const response = await fetch(`https://api.openai.com/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI Files API error: ${response.status} ${error}`);
    }
  }
}
