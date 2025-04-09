import { FastifyInstance } from 'fastify'
import { UserRoutes } from './UserRoutes.js'
import { AuthRoutes } from './AuthRoutes.js'
import { GHLWebhookRoutes } from './GHLWebhookRoutes.js'

export default async function router(fastify: FastifyInstance):Promise<void> {
  console.log('Routes registered')
  fastify.register(UserRoutes)
  fastify.register(AuthRoutes)
  fastify.register(GHLWebhookRoutes)
}
