import { FastifyInstance, FastifyRequest, FastifyReply, FastifyPluginAsync } from 'fastify';
import { handleGHLWebhook } from '../services/WebhookService';

export const GHLWebhookRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post(
    '/gohighlevel-webhooks',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await handleGHLWebhook(request.body);
        return reply.status(204).send();
      } catch (err: any) {
        request.log.error('Error handling GHL webhook:', err);
        return reply
          .status(500)
          .send({ error: 'Error handling webhook', details: err.message });
      }
    }
  );
};