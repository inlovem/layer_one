// // src/routes/MessageRoutes.ts

// import * as MessageController from '../controllers/index';
// import {
//   FastifyInstance,
//   FastifyPluginAsync,
//   FastifyReply,
//   FastifyRequest,
//   FastifyPluginOptions
// } from 'fastify';
// import * as schema from '../schema/index';
// import { authenticateUser } from '../utils/authenticatUser';

// const messagePath = '/messages';

// /**
//  * Defines the routes for user-related operations.
//  *
//  * @param fastify - The Fastify instance.
//  * @param opts - The plugin options.
//  */
// export async function MessageRoutes(
//   fastify: FastifyInstance
// ) {
//   fastify.route({
//     method: 'GET',
//     url: `${messagePath}/:messageId`,
//     schema: schema.GetUserSchema,
//     preHandler: [authenticateUser],
//     handler: MessageController.
//   });
// };
