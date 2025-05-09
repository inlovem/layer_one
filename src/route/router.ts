import { FastifyInstance } from 'fastify'
import { UserRoutes } from './UserRoutes'
import { AuthRoutes } from './AuthRoutes'
import { GHLWebhookRoutes } from './GHLWebhookRoutes'

export default async function router(fastify: FastifyInstance):Promise<void> {
  console.log('Routes registered')
  fastify.register(UserRoutes)
  fastify.register(AuthRoutes)
  fastify.register(GHLWebhookRoutes)
}
