import fastify from 'fastify';
import router from './route/router';
import cors from '@fastify/cors';
import fjwt from '@fastify/jwt';
import fCookie from '@fastify/cookie';
import { schedulerPlugin } from './utils/scheduler';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

const server = fastify({
  logger: process.env.NODE_ENV !== 'development',
});

let PORT = Number(process.env.PORT) || 8080;
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a fixed port for easier debugging
  PORT = 3006;
}



// Register Swagger
server.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'API Documentation',
      description: 'API documentation Layer-1 Orchestration',
      version: '1.0.0'
    },
    host: process.env.NODE_ENV === 'production'
      ? process.env.HOST_URL || 'https://layer-one-b04e43b6a256.herokuapp.com'
      : `localhost:${PORT}`,
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'api', description: 'API endpoints' },
    ],
  }
});

// Register Swagger UI
server.register(fastifySwaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  },
  staticCSP: true
});

// Register other plugins
server.register(fjwt, { secret: process.env.JWT_SECRET || 'default_secret' });
server.register(fCookie, { secret: process.env.COOKIE_SECRET || 'some-secret-key' });
server.register(cors, { origin: '*' });
server.register(router);

const startServer = async (): Promise<void> => {
  try {
    // Register the scheduler plugin before starting the server.
    await server.register(schedulerPlugin);
    await server.listen({ port: PORT, host: '0.0.0.0' });
    
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
    console.log(`API Documentation available at http://0.0.0.0:${PORT}/documentation`);
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