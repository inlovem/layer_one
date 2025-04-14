// src/routes/UserRoutes.ts

import * as UserController from '../controllers/index';
import {
  FastifyInstance
} from 'fastify';
import * as schema from '../schema/index';
import { authenticateUser } from '../utils/authenticatUser';

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
