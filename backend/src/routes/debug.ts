import { FastifyInstance } from 'fastify';
import { prisma } from '../db/prismaClient';

export async function debugRoutes(fastify: FastifyInstance) {
  fastify.get('/api/debug/db', async (request, reply) => {
    try {
      const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as db_version`;
      return reply.send({ 
        status: 'ok', 
        database: result,
        prisma_version: require('@prisma/client/package.json').version,
        node_env: process.env.NODE_ENV,
        has_database_url: !!process.env.DATABASE_URL
      });
    } catch (error) {
      return reply.status(500).send({ 
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        node_env: process.env.NODE_ENV
      });
    }
  });

  fastify.get('/api/debug/uuid', async (request, reply) => {
    try {
      const testUuid = await prisma.$queryRaw`SELECT gen_random_uuid() as test_uuid`;
      return reply.send({ 
        status: 'ok', 
        uuid_generation: testUuid
      });
    } catch (error) {
      return reply.status(500).send({ 
        error: 'UUID generation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}
