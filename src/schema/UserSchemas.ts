// src/schemas/UserSchemas.ts

import { Type } from "@fastify/type-provider-typebox";
import { FastifySchema } from "fastify";
import {
  ERROR400,
  ERROR401,
  ERROR404,
  ERROR409,
  ERROR500,
  responseProperty,
} from "../constants/constants";


export const GetUserSchema: FastifySchema = {
  querystring: Type.Object({
    userId: Type.String()
  }),
  response: {
    200: Type.Object({
      user: Type.Object({
        id: Type.String(),
        email: Type.String(),
        phone: Type.Optional(Type.String()),
        firstName: Type.Optional(Type.String()),
        lastName: Type.Optional(Type.String()),
        name: Type.Optional(Type.String()),
        status: Type.Optional(Type.String()),
        type: Type.Optional(Type.String()),
      }),
    }),
    400: ERROR400,
    401: ERROR401,
    404: ERROR404,
    409: ERROR409,
    500: ERROR500,
  },
};

const UpdateUserQuerySchema = Type.Object({
  userId: Type.String(),
  refresh: Type.Optional(Type.Boolean()),
});

export const UpdateUserSchema: FastifySchema = {
  querystring: UpdateUserQuerySchema,
  body: Type.Object({
    firstName: Type.Optional(Type.String()),
    lastName: Type.Optional(Type.String()),
    email: Type.Optional(Type.String({ format: "email" })),
    phone: Type.Optional(Type.String()),
  }),
  response: {
    200: Type.Object({
      user: Type.Object({
        id: Type.String(),
        email: Type.String(),
        phone: Type.Optional(Type.String()),
        firstName: Type.Optional(Type.String()),
        lastName: Type.Optional(Type.String()),
        name: Type.Optional(Type.String()),
        status: Type.Optional(Type.String()),
        type: Type.Optional(Type.String()),
        tags: Type.Optional(Type.Array(Type.String())),
        sortOrder: Type.Optional(Type.Number()),
        createdAt: Type.String({ format: "date-time" }),
        updatedAt: Type.String({ format: "date-time" }),
      }),
    }),

    400: ERROR400,
    500: ERROR500,
  },
};

export const CreateUserSchema: FastifySchema = {
  body: Type.Object({
    firstName: Type.String(),
    lastName: Type.String(),
    email: Type.String({ format: "email" }),
    phone: Type.Optional(Type.String()),
  }),
  response: {
    200: Type.Object({
      user: Type.Optional(
        Type.Object({
          id: Type.String(),
          email: Type.String(),
          phone: Type.Optional(Type.String()),
          firstName: Type.Optional(Type.String()),
          lastName: Type.Optional(Type.String()),
          name: Type.Optional(Type.String()),
          status: Type.Optional(Type.String()),
          type: Type.Optional(Type.String()),
          tags: Type.Optional(Type.Array(Type.String())),
          sortOrder: Type.Optional(Type.Number()),
          createdAt: Type.String({ format: "date-time" }),
          updatedAt: Type.String({ format: "date-time" }),
          // User: Type.Optional(Type.Array(Type.Object({}))), // Detailed user schema could be placed here
          // Organization: Type.Optional(Type.Array(Type.Object({}))), // Detailed organization schema could be placed here
        })
      ),
    }),
    400: ERROR400,
    500: ERROR500,
  },
};

export const GetUserByEmailSchema: FastifySchema = {
  querystring: Type.Object({
    email: Type.String({ format: "email" }),
  }),
  response: {
    200: Type.Object({
      user: Type.Object({
        id: Type.String(),
        email: Type.String(),
        phone: Type.Optional(Type.String()),
        firstName: Type.String(),
        lastName: Type.String(),
        name: Type.String(),
        status: Type.Optional(Type.String()),
      }),
    }),
    400: ERROR400,
    500: ERROR500,
  },
};
