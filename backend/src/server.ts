import { createApp } from './app';
import { prisma } from './db/prismaClient';
const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
async function start() {
  const app = createApp();
  try {
    await prisma.$connect();
    console.log('Connected to database');
    await app.listen({ port: PORT, host: HOST });
    console.log(`Server started on http://${HOST}:${PORT}`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
start();
