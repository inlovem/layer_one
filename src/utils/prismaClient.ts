// src/db/prismaClient.ts

import { PrismaClient, Prisma } from '@prisma/client';

/**
 * We define a singleton pattern for PrismaClient so we only create one instance.
 * The typed approach for middleware uses Prisma.MiddlewareParams, etc.
 */
let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient();

    // Use the official Prisma types for strongly-typed middleware
    prisma.$use(async (params: Prisma.MiddlewareParams, next: Prisma.MiddlewareNext) => {
      // The 'params' object is typed: 
      //   model: string | undefined
      //   action: string
      //   args: any
      //   dataPath: string[]
      //   runInTransaction: boolean

      console.log(`Query: ${params.model}.${params.action}  args=`, params.args);

      const before = Date.now();
      const result = await next(params);
      const after = Date.now();

      console.log(`Query took ${after - before}ms`);

      return result;
    });

    console.log('Prisma Client instance created');
  }

  return prisma;
}
