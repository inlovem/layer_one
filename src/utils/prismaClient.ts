import { PrismaClient } from '@prisma/client'

const initializePrismaClient = (): PrismaClient => {
  const prismaClient = new PrismaClient()

  // Middleware for logging and measuring query execution time
  prismaClient.$use(async (params:any, next:any) => {
    // Before query execution
    console.log(`Query: ${params.model}.${params.action}`, params.args)

    const before = Date.now()
    const result = await next(params) // Execute the query
    const after = Date.now()

    // After query execution
    console.log(`Query took ${after - before}ms`)

    return result // Return the query result
  })

  console.log('Prisma Client instance created')
  return prismaClient
}

export const prisma = initializePrismaClient()
