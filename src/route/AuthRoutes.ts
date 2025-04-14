// src/routes/AuthRoutes.ts

import {
  FastifyInstance,
} from "fastify";
import * as AuthController from "../controllers/index";
import  * as schemas from "../schema/AuthSchemas";
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
    schema: schemas.ExchangeCodeSchema,
    handler: AuthController.handleInitialInstall
  });

  fastify.route({
    method: "POST",
    url: `${authPath}/validate-sso`,
    schema: schemas.ValidateSsoSchema,
    handler: AuthController.validateSsoController
  });
};


