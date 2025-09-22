import fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { errorHandler } from './middleware/errorHandler';
import { authRoutes } from './routes/auth';
import { userRoutes } from './routes/users';
import { projectRoutes } from './routes/projects';
import { promptRoutes } from './routes/prompts';
import { chatRoutes } from './routes/chat';
import { fileRoutes } from './routes/files';
export const createApp = () => {
  const app = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });
  app.register(cors, {
    origin: process.env.FRONTEND_URL || ['http://localhost:8080', 'http://localhost:5173'],
    credentials: true,
  });
  app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });
  app.setErrorHandler(errorHandler);
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
  app.register(authRoutes);
  app.register(userRoutes);
  app.register(projectRoutes);
  app.register(promptRoutes);
  app.register(chatRoutes);
  app.register(fileRoutes);
  return app;
};
