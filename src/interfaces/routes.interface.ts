// src/interfaces/routes.interface.ts
// Purpose: Interface for routes in the application.
import { FastifyInstance, RouteOptions } from 'fastify'

/**
 * Represents a route in the application.
 */
export interface Routes {
  /**
   * The path of the route.
   */
  path: string

  /**
   * Initializes the routes for the specified Fastify instance.
   * 
   * @param fastify - The Fastify instance.
   * @param opts - The route options.
   * @param done - A callback function to be called when the routes are initialized.
   */
  initializeRoutes: (
    fastify: FastifyInstance,
    opts: RouteOptions,
    done: () => void,
  ) => void
}
