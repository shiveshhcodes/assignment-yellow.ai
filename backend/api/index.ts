import { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../src/app';

let app: any = null;

const getApp = async () => {
  if (!app) {
    app = createApp();
    await app.ready();
  }
  return app;
};

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const fastify = await getApp();
    fastify.server.emit('request', req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
