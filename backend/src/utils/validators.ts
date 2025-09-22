import { z } from 'zod';
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});
export const createPromptSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});
export const chatMessageSchema = z.object({
  message: z.string().min(1),
});
export const uploadFileSchema = z.object({
  filename: z.string().min(1),
});
export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type CreateProjectData = z.infer<typeof createProjectSchema>;
export type CreatePromptData = z.infer<typeof createPromptSchema>;
export type ChatMessageData = z.infer<typeof chatMessageSchema>;
export type UploadFileData = z.infer<typeof uploadFileSchema>;
