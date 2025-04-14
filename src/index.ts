import fastify from 'fastify';
import router from './route/router';
import cors from '@fastify/cors';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import { schedulerPlugin } from './utils/scheduler';

const server = fastify({
  logger: process.env.NODE_ENV !== 'development',
});

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 8080;

server.register(fjwt, { secret: process.env.JWT_SECRET || 'default_secret' });
server.register(fCookie, { secret: process.env.COOKIE_SECRET || 'some-secret-key' });
server.register(cors, { origin: '*' });
server.register(router);

const startServer = async (): Promise<void> => {
  try {
    // Register the scheduler plugin before starting the server.
    await server.register(schedulerPlugin);
    await server.listen({ port: FASTIFY_PORT, host: '0.0.0.0' });
    
    console.log(`Server listening at http://0.0.0.0:${FASTIFY_PORT}`);
  } catch (err) {
    console.error('Failed to start the server:', err);
    process.exit(1);
  }
};

startServer();

// Gracefully handle shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await server.close();
  console.log('Server has been closed');
  process.exit(0);
});
