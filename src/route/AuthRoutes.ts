// src/routes/AuthRoutes.ts

import {
  FastifyInstance,
} from "fastify";
import * as AuthController from "../controllers/index";
const authPath = "/auth";

/**
 * Defines the authentication routes.
 *
 * @param fastify - The Fastify instance.
 * @param opts - The plugin options.
 */

export async function AuthRoutes (
  fastify: FastifyInstance
) {
  fastify.route({
    method: "POST",
    url: `${authPath}/exchange-code`,
    handler: AuthController.handleInitialInstall
  });

  fastify.route({
    method: "POST",
    url: `${authPath}/validate-sso`,
    handler: AuthController.validateSsoController
  });
};


