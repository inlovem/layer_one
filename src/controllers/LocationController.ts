// src/controllers/LocationController.ts

import { prisma } from "../utils/prismaClient.js";

interface LocationInput {
  type: 'LocationCreate' | 'LocationUpdate' | 'INSTALL'
  id: string
  locationId?: string
  companyId: string
  name?: string
  email?: string
  stripeProductId?: string
  appId?: string
  installType?: string
  userId?: string
  planId?: string
  trial?: any
}

export async function locationController(variables: LocationInput) {
  let token
  try {
    if (variables.type === 'INSTALL') {
     token =  await prisma.location.upsert({
        where: {
          locationId: variables.locationId 
        },
        create: {
          locationId: variables.locationId, 
          companyId: variables.companyId,
          appId: variables.appId || '',
          name: 'Default Location Name',
          stripeProductId: ''
        },
        update: {
          companyId: variables.companyId,
          appId: variables.appId || ''
        }
      })
      return
    }

    if (!variables.name) {
      throw new Error("Name and email are required")
    }

    token = await prisma.location.upsert({
      where: {
        locationId: variables.locationId || variables.id
      },
      create: {
        locationId: variables.locationId || variables.id,
        companyId: variables.companyId,
        name: variables.name,
        email: variables.email || '',
        stripeProductId: variables.stripeProductId || '',
        appId: variables.appId || ''
      },
      update: {
        companyId: variables.companyId,
        name: variables.name,
        email: variables.email,
        stripeProductId: variables.stripeProductId,
        appId: variables.appId || ''
      }
    })

    return
  } catch (error) {
    console.error(error)
    const action = variables.type === 'INSTALL' 
      ? 'install'
      : variables.type === 'LocationCreate' 
        ? 'create' 
        : 'update'
    throw new Error(`Failed to ${action} location`)
  }
}
