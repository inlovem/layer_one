// src/routes/UserRoutes.ts

import * as UserController from '../controllers/index.js';
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest,
  FastifyPluginOptions
} from 'fastify';
import * as schema from '../schema/index.js';
import { authenticateUser } from '../utils/authenticatUser.js';

const userPath = '/user';

/**
 * Defines the routes for user-related operations.
 *
 * @param fastify - The Fastify instance.
 * @param opts - The plugin options.
 */
export async function UserRoutes(
  fastify: FastifyInstance
) {
  fastify.route({
    method: 'GET',
    url: `${userPath}/:userId`,
    schema: schema.GetUserSchema,
    preHandler: [authenticateUser],
    handler: UserController.getUserController
  });
};
