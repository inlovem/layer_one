// src/controllers/UserController.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../utils/prismaClient.js'
import * as userTypes from '../types/userTypes'



export async function getUserController(
  request: FastifyRequest <{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  const { userId } = request.params;
  if (!userId ) {
    throw new Error('Must provide either id, userId, or email to retrieve user')
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        userId: userId
      },
      include: {
        locations: true,
        searchHistory: true,
        favorites: true,
        LocationMember: true
      }
    })
    return reply.send({user})
  } catch (error) {
    console.error('Error getting user:', error)
    throw new Error('Failed to retrieve user')
  }
}
 
 export async function updateUserController(input: userTypes.UserInput) {
  try {
    // Handle different input types and normalize data
    const userData = normalizeUserData(input)
 
    const user = await prisma.user.upsert({
      where: {
        id: userData.id || undefined,
        email: userData.email || undefined,
        userId: userData.userId || undefined,
      },
      create: {
        userId: userData.userId,
        locationId: userData.locationId,
        companyId: userData.companyId,
        userName: userData.userName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: 'password' in input ? input.password : undefined,
        phone: userData.phone || '',
        extension: userData.extension,
        type: userData.type,
        role: userData.role,
        isEjectedUser: 'isEjectedUser' in input ? input.isEjectedUser : false,
        locationIds: userData.locationIds || [],
        permissions: userData.permissions
      },
      update: {
        userId: userData.userId,
        locationId: userData.locationId,
        companyId: userData.companyId,
        userName: userData.userName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        extension: userData.extension,
        type: userData.type,
        role: userData.role,
        locationIds: userData.locationIds || [],
        permissions: userData.permissions
      },
      include:{
        searchHistory: true,
      }
    })
  
    
    return user
  } catch (error) {
    console.error('Error in user controller:', error)
    throw new Error('Failed to process user')
  }
 }
 function normalizeUserData(input: userTypes.UserInput): userTypes.UserBaseInput {
  // Handle SSO input (when we have userName but not firstName/lastName)
  if ('userName' in input && !input.firstName && !input.lastName) {
    const nameParts = input.userName?.split(' ') || ['', '']
    return {
      userId: input.userId,
      locationId: input.activeLocation || input.locationId,
      companyId: input.companyId,
      userName: input.userName,
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' '),
      email: input.email,
      role: input.role,
      type: input.type,
      locationIds: input.activeLocation ? [input.activeLocation] : input.locationIds || []
    }
  }

  // Handle webhook/direct input
  if (input.firstName && input.lastName) {
    return {
      userId: input.userId || input.id,
      userName: input.userName || `${input.firstName} ${input.lastName}`,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      role: input.role || 'user',
      phone: input.phone || '',
      extension: input.extension,
      locationIds: input.locationIds || []
    }
  }

  return {
    ...input,
    locationIds: input.locationIds || []
  }
}


/**
 * Adds a new user to the system.
 * @param variables - The user details.
 * @returns A promise that resolves to the added user.
 * @throws An error if the email is missing or if the first name and last name are missing.
 */
export async function userController(variables: {
  type: 'UserCreate' | 'UserUpdate'
  locationId: string
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  extension?: string
  role?: string
  permissions?: {
    adwordsReportingEnabled?: boolean
    affiliateManagerEnabled?: boolean
    agentReportingEnabled?: boolean
    appointmentsEnabled?: boolean
    assignedDataOnly?: boolean
    attributionsReportingEnabled?: boolean
    bloggingEnabled?: boolean
    botService?: boolean
    bulkRequestsEnabled?: boolean
    campaignsEnabled?: boolean
    campaignsReadOnly?: boolean
    cancelSubscriptionEnabled?: boolean
    communitiesEnabled?: boolean
    contactsEnabled?: boolean
    contentAiEnabled?: boolean
    conversationsEnabled?: boolean
    dashboardStatsEnabled?: boolean
    facebookAdsReportingEnabled?: boolean
    funnelsEnabled?: boolean
    invoiceEnabled?: boolean
    leadValueEnabled?: boolean
    marketingEnabled?: boolean
    membershipEnabled?: boolean
    onlineListingsEnabled?: boolean
    opportunitiesEnabled?: boolean
    paymentsEnabled?: boolean
    phoneCallEnabled?: boolean
    recordPaymentEnabled?: boolean
    refundsEnabled?: boolean
    reviewsEnabled?: boolean
    settingsEnabled?: boolean
    socialPlanner?: boolean
    tagsEnabled?: boolean
    triggersEnabled?: boolean
    websitesEnabled?: boolean
    workflowsEnabled?: boolean
    workflowsReadOnly?: boolean
  }
 }) {
  // Validate required fields
  if (!variables.firstName || !variables.lastName || !variables.email) {
    throw new Error('First name, last name, email and phone are required')
  }
 
  const company_id = await prisma.location.findFirst({
    where: {
      id: variables.locationId
    },
    select: {
      companyId: true
    }
  })
  try {
    await prisma.user.upsert({
      where: { 
        id: variables.id 
      },
      create: {
        locationId: variables.locationId,
        firstName: variables.firstName,
        lastName: variables.lastName,
        userId: variables.id,
        email: variables.email || '',
        phone: variables.phone || '',
        extension: variables.extension,
        role: variables.role,
        permissions: variables.permissions,
        companyId: company_id?.companyId || ''
      },
      update: {
        locationId: variables.locationId,
        firstName: variables.firstName,
        lastName: variables.lastName,
        email: variables.email || '',
        phone: variables.phone || '',
        extension: variables.extension,
        role: variables.role,
        permissions: variables.permissions,
        userId: variables.id,
        companyId: company_id?.companyId || ''
      }
    })
 
    return
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to ${variables.type === 'UserCreate' ? 'create' : 'update'} user`)
  }
 }

