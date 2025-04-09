import { Scheduler } from 'toad-scheduler';

declare module 'fastify' {
  interface FastifyInstance {
    scheduler: Scheduler;
  }
}
