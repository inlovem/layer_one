// src/controllers/UserController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import admin from 'src/utils/firebase';
import * as userTypes from '../types/userTypes';

/**
 * Retrieves a user by userId from Firestore.
 * This example assumes related data is stored in subcollections.
 */
export async function getUserController(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  const { userId } = request.params;
  if (!userId) {
    throw new Error('Must provide either id, userId, or email to retrieve user');
  }
  try {
    const db = admin.firestore();
    // Query the users collection for a document where the field "userId" equals the provided userId.
    const usersRef = db.collection('users');
    const querySnapshot = await usersRef.where('userId', '==', userId).limit(1).get();

    if (querySnapshot.empty) {
      return reply.send({ user: null });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Optionally, fetch related subcollections in parallel.
    const subCollections = ['locations', 'searchHistory', 'favorites', 'LocationMember'];
    const subDataPromises = subCollections.map(async (subColl) => {
      const subSnapshot = await userDoc.ref.collection(subColl).get();
      return { [subColl]: subSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) };
    });
    const subDataArray = await Promise.all(subDataPromises);
    const subData = subDataArray.reduce((acc, curr) => Object.assign(acc, curr), {});

    return reply.send({ user: { ...userData, ...subData } });
  } catch (error) {
    console.error('Error getting user:', error);
    throw new Error('Failed to retrieve user');
  }
}

/**
 * Updates or creates (upserts) a user in Firestore.
 * Uses Firestore’s set() method with { merge: true } to simulate an upsert.
 */
export async function updateUserController(input: userTypes.UserInput) {
  try {
    // Normalize and prepare the user data
    const userData = normalizeUserData(input);
    const db = admin.firestore();
    // Using userData.userId as the document id
    if (!userData.userId) {
      throw new Error('User ID is required');
    }
    const userRef = db.collection('users').doc(userData.userId);

    // Firestore's set() with merge true performs an upsert (create if not exists, update if exists)
    await userRef.set(
      {
        userId: userData.userId,
        locationId: userData.locationId,
        companyId: userData.companyId,
        userName: userData.userName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        // Conditionally include password if provided
        ...( 'password' in input ? { password: input.password } : {} ),
        phone: userData.phone || '',
        extension: userData.extension,
        type: userData.type,
        role: userData.role,
        isEjectedUser: 'isEjectedUser' in input ? input.isEjectedUser : false,
        locationIds: userData.locationIds || [],
        permissions: userData.permissions,
      },
      { merge: true }
    );

    // Optionally, fetch and include related subcollection data (e.g. searchHistory)
    const updatedUserDoc = await userRef.get();
    const updatedUser = updatedUserDoc.data();
    const searchHistorySnapshot = await userRef.collection('searchHistory').get();
    if (updatedUser){
    updatedUser.searchHistory = searchHistorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    return updatedUser;
  } catch (error) {
    console.error('Error in user controller:', error);
    throw new Error('Failed to process user');
  }
}

/**
 * Normalizes input data for user updates/creation.
 */
function normalizeUserData(input: userTypes.UserInput): userTypes.UserBaseInput {
  // Handle SSO input (when we have userName but not firstName/lastName)
  if ('userName' in input && !input.firstName && !input.lastName) {
    const nameParts = input.userName?.split(' ') || ['', ''];
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
    };
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
    };
  }

  return {
    ...input,
    locationIds: input.locationIds || []
  };
}

/**
 * Adds a new user to the system by performing an upsert in Firestore.
 * Retrieves the companyId from the related location document.
 */
export async function userController(variables: {
  type: 'UserCreate' | 'UserUpdate';
  locationId: string;
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  extension?: string;
  role?: string;
  permissions?: {
    adwordsReportingEnabled?: boolean;
    affiliateManagerEnabled?: boolean;
    agentReportingEnabled?: boolean;
    appointmentsEnabled?: boolean;
    assignedDataOnly?: boolean;
    attributionsReportingEnabled?: boolean;
    bloggingEnabled?: boolean;
    botService?: boolean;
    bulkRequestsEnabled?: boolean;
    campaignsEnabled?: boolean;
    campaignsReadOnly?: boolean;
    cancelSubscriptionEnabled?: boolean;
    communitiesEnabled?: boolean;
    contactsEnabled?: boolean;
    contentAiEnabled?: boolean;
    conversationsEnabled?: boolean;
    dashboardStatsEnabled?: boolean;
    facebookAdsReportingEnabled?: boolean;
    funnelsEnabled?: boolean;
    invoiceEnabled?: boolean;
    leadValueEnabled?: boolean;
    marketingEnabled?: boolean;
    membershipEnabled?: boolean;
    onlineListingsEnabled?: boolean;
    opportunitiesEnabled?: boolean;
    paymentsEnabled?: boolean;
    phoneCallEnabled?: boolean;
    recordPaymentEnabled?: boolean;
    refundsEnabled?: boolean;
    reviewsEnabled?: boolean;
    settingsEnabled?: boolean;
    socialPlanner?: boolean;
    tagsEnabled?: boolean;
    triggersEnabled?: boolean;
    websitesEnabled?: boolean;
    workflowsEnabled?: boolean;
    workflowsReadOnly?: boolean;
  }
}) {
  // Validate required fields
  if (!variables.firstName || !variables.lastName || !variables.email) {
    throw new Error('First name, last name, email and phone are required');
  }

  const db = admin.firestore();
  // Retrieve the companyId from the related location document
  const locationDoc = await db.collection('locations').doc(variables.locationId).get();
  const companyId = locationDoc.exists ? (locationDoc.data()?.companyId || '') : '';

  try {
    // Use variables.id as the document id for the user
    const userRef = db.collection('users').doc(variables.id);
    await userRef.set(
      {
        locationId: variables.locationId,
        firstName: variables.firstName,
        lastName: variables.lastName,
        userId: variables.id,
        email: variables.email || '',
        phone: variables.phone || '',
        extension: variables.extension,
        role: variables.role,
        permissions: variables.permissions,
        companyId: companyId,
      },
      { merge: true }
    );
    return;
  } catch (error) {
    console.error(error);
    throw new Error(`Failed to ${variables.type === 'UserCreate' ? 'create' : 'update'} user`);
  }
}
