import axios from 'axios';
import CryptoJS from 'crypto-js';
import { updateUserController } from './UserController';
import { Token } from "../types/types";
import admin from '../utils/firebase';
import { Partial } from "@sinclair/typebox";
import jwt from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from "fastify";

/**
 * Handles the initial installation of the application by exchanging an authorization code for a token.
 * This is the first step in the OAuth flow.
 * 
 * @param request - The Fastify request object containing the authorization code.
 * 
 * @param reply - The Fastify reply object used to send the response.
 * @returns A response indicating success or failure.
 * @throws An error if the token exchange fails.
 * @throws An error if the token data is missing required fields.
 * @throws An error if the SSO token decryption fails.
 * @throws An error if the user update fails.
 * @throws An error if the JWT creation fails.
 * 
 */
export async function handleInitialInstall(
  request: FastifyRequest<{ Body: { code: string } }>,
  reply: FastifyReply
) {
  try {
    const { code } = request.body;
    const companyTokenData = await getGHLToken('authorization_code', code, undefined, '');

    if (!companyTokenData || !companyTokenData.companyId || !companyTokenData.access_token) {
      throw new Error('Missing companyId or access_token from the company token data!');
    }
    

    await attemptFetchLocationToken(companyTokenData.companyId, companyTokenData.access_token);

    return reply.send({ success: true, companyId: companyTokenData.companyId, redirectUri: process.env.GOHL_REDIRECT_URI });

  } catch (error) {
    console.error("Token exchange error:", error);
    return reply.status(500).send({
      error: "Failed to exchange code for token",
    });
  }
}

/**
 * Validates the SSO token and creates a JWT for the user.
 * 
 * @param request - The Fastify request object containing the SSO token.
 * @param reply - The Fastify reply object used to send the response.
 * @returns A response containing the user data and JWT token.
 * @throws An error if the SSO token decryption fails.
 * @throws An error if the user update fails.
 * @throws An error if the JWT creation fails.
 */
export const validateSsoController = async (
  request: FastifyRequest<{ Body: { ssoToken: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const userData = await decryptSSO(request.body.ssoToken);
    if (!userData) {
      throw new Error('Invalid SSO token');
    }
    const jwtToken = createJwtForUser(userData);
    reply.header(
      "Set-Cookie",
      `token=${jwtToken}; HttpOnly; Path=/; Secure; SameSite=Strict`
    );
    reply.send({
      status: "success",
      data: userData,
      token: jwtToken,
    });
  } catch (error) {
    console.error("SSO Decryption error:", error);
    return reply.status(401).send({
      error: "Invalid SSO token",
    });
  }
};

/**
 * Creates a JWT for the user.
 * 
 * @param userData - The user data to include in the JWT payload.
 * @returns The generated JWT token.
 * @throws An error if the JWT creation fails.
 */
const createJwtForUser = (userData: any): string => {
  const JWT_SECRET = process.env.JWT_SECRET || '';
  const payload = {
    id: userData.userId,
    email: userData.email,
    role: userData.role,
    locationId: userData.locationId,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '100h' });
};

/**
 * Helper function that decrypts the SSO token using CryptoJS.
 * 
 * @param encryptedToken - The encrypted SSO token.
 * @returns The decrypted user data.
 * @throws An error if the decryption fails.
 * @throws An error if the user update fails.
 * @throws An error if the JWT creation fails.
 */
async function decryptSSO(encryptedToken: string): Promise<any> {
  const SSO_KEY = process.env.GHL_SSO_KEY || '';
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, SSO_KEY);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
      throw new Error('Decryption returned an empty string. Possibly bad key or format mismatch.');
    }
    const userData = JSON.parse(decryptedText);
    console.log('Decrypted user data:', userData);
    // Update user in the database (Firestore-based updateUserController)
    const updatedUser = await updateUserController({
      userId: userData.userId,
      companyId: userData.companyId,
      userName: userData.userName,
      email: userData.email,
      role: userData.role,
      type: userData.type,
      activeLocation: userData.activeLocation,
    }).catch((error) => {
      console.error('Error updating user:', error);
      throw error;
    });
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }
    const searchHistory = updatedUser.searchHistory || [];
    return { ...userData, searchHistory };
  } catch (error) {
    console.error('Failed to decrypt SSO token:', error);
    throw new Error('Failed to decrypt SSO token');
  }
}

/**
 * Attempts to fetch tokens for all locations related to a given company.
 * 
 * @param companyId - The ID of the company.
 * @param access_token - The access token for the company.
 * @param retriesLeft - The number of retries left (default is 3).
 * @returns A promise that resolves when the tokens have been fetched.
 * @throws An error if the token fetching fails.
 */
export async function attemptFetchLocationToken(
  companyId: string,
  access_token: string,
  retriesLeft = 3
) {
  try {
    await getLocationTokens(companyId, access_token);
  } catch (err) {
    if (retriesLeft <= 1) {
      console.error(`Location token final fail:`, err);
      return;
    }
    console.warn(`Retrying location token`);
    // Wait 1 minute before retrying
    setTimeout(() => attemptFetchLocationToken(companyId, access_token, retriesLeft - 1), 60_000);
  }
}

/**
 * Fetches all locations for the given company from Firestore and attempts to retrieve tokens.
 * 
 * @param companyId - The ID of the company.
 * @param access_token - The access token for the company.
 * @returns A promise that resolves when the tokens have been fetched.
 * @throws An error if the token fetching fails.
 * @throws An error if the token update fails.
 */
async function getLocationTokens(companyId: string, access_token?: string): Promise<any> {
  const db = admin.firestore();
  const locationsSnapshot = await db.collection('locations').where('companyId', '==', companyId).get();
  const locations = locationsSnapshot.docs.map(doc => doc.data());
  await Promise.all(
    locations.map(async (loc: any) => {
      try {
        const locationTokenPayload: Partial<Token> = {
          userType: 'Location',
          locationId: loc.locationId || '',
          companyId: companyId,
          access_token: access_token || '',
        };
        const locTokenData = await getGHLToken('', '', locationTokenPayload, access_token);
        console.log(`✔️ Location token fetched for locationId=${loc.locationId}`, locTokenData);
      } catch (err) {
        console.error(`❌ Failed to fetch location token for locationId=${loc.locationId}`, err);
      }
    })
  );
}

/**
 * Retrieves a token from GHL. If token details are provided for a Location,
 * the appropriate endpoint is called; otherwise, the Company token endpoint is used.
 * 
 * @param grant_type - The type of grant (e.g., 'authorization_code').
 * @param code - The authorization code (optional).
 * @param token - The token details (optional).
 * @param auth_token - The authorization token (optional).
 * @returns A promise that resolves to the token data.
 * @throws An error if the token exchange fails.
 * @throws An error if the token update fails.
 */
export const getGHLToken = async (
  grant_type: string,
  code?: string,
  token?: Partial<Token>,
  auth_token?: string
): Promise<any> => {
  if (token && token.userType === 'Location' && token.locationId && token.companyId) {
    const encodedParams = new URLSearchParams();
    encodedParams.set('companyId', token.companyId);
    encodedParams.set('locationId', token.locationId);

    console.log('📨 Making token request with code:', code);
    console.log('📨 Params:', encodedParams.toString());

    const options = {
      method: 'POST',
      url: 'https://services.leadconnectorhq.com/oauth/locationToken',
      headers: {
        Authorization: `Bearer ${auth_token}`,
        Version: '2021-07-28',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      data: encodedParams,
    };
    try {
      const { data } = await axios.request(options);
      console.log('📥 Company token exchange success:', data);
      await updateAccessToken(data);
      return data;
    } catch (err: any) {
      console.error('❌ GHL token exchange error:');
      console.error('↳ Message:', err.message);
      console.error('↳ Status:', err.response?.status);
      console.error('↳ Response Data:', err.response?.data);
      console.error('↳ Headers:', err.response?.headers);
      throw err;
    }
    
  } else {
    const encodedParams = new URLSearchParams({
      client_id: process.env.GOHL_CLIENT_ID!,
      client_secret: process.env.GOHL_CLIENT_SECRET!,
      grant_type: grant_type,
      code: code || '',
      refresh_token: token ? token.refresh_token || '' : '',
      redirect_uri: process.env.GOHL_REDIRECT_URI!,
      user_type: 'Company',
    });
    const options = {
      method: 'POST',
      url: 'https://services.leadconnectorhq.com/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      data: encodedParams,
    };
    try {
      const { data } = await axios.request(options);
      console.log('Company token exchange:', data);
      await updateAccessToken(data);
      return data;
    } catch (err: any) {
      console.error('Token exchange error:', err?.response?.data || err.message);
      throw err; // bubble up for visibility
    }    
  }
};

/**
 * Updates (or creates) a token in Firestore based on the provided token data.
 * Checks for undefined values and uses Firestore queries to simulate upsert behavior.
 * 
 * @param token - The token data to update or create.
 * @throws An error if the companyId is missing in the token data.
 * @throws An error if the locationId is missing in the token data.
 * 
 */
async function updateAccessToken(token: Partial<Token>) {
  // Remove any extraneous properties
  delete token.traceId;
  const db = admin.firestore();
  if (token.companyId) {
    if (token.locationId) {
      // Search for an existing token with the matching companyId and locationId
      const tokensQuerySnapshot = await db.collection('tokens')
        .where('companyId', '==', token.companyId)
        .where('locationId', '==', token.locationId)
        .limit(1)
        .get();
      if (!tokensQuerySnapshot.empty) {
        const existingTokenDoc = tokensQuerySnapshot.docs[0];
        await existingTokenDoc.ref.set(token, { merge: true });
        return;
      } else {
        // Create a new token document if one doesn't exist
        await db.collection('tokens').add({
          access_token: token.access_token || "",
          token_type: token.token_type || "",
          expires_in: token.expires_in || 0,
          refresh_token: token.refresh_token || "",
          userId: token.userId || "",
          approvedLocations: token.approvedLocations || [],
          scope: token.scope || "",
          userType: token.userType || "",
          locationId: token.locationId,
          companyId: token.companyId,
        });
        return;
      }
    } else {
      // When locationId is undefined, search for a token with locationId equal to null
      const tokensQuerySnapshot = await db.collection('tokens')
        .where('companyId', '==', token.companyId)
        .where('locationId', '==', null)
        .limit(1)
        .get();
      if (!tokensQuerySnapshot.empty) {
        const existingTokenDoc = tokensQuerySnapshot.docs[0];
        await existingTokenDoc.ref.set(token, { merge: true });
        return;
      } else {
        await db.collection('tokens').add({
          access_token: token.access_token || "",
          token_type: token.token_type || "",
          expires_in: token.expires_in || 0,
          refresh_token: token.refresh_token || "",
          userId: token.userId || "",
          approvedLocations: token.approvedLocations || [],
          scope: token.scope || "",
          userType: token.userType || "",
          locationId: null,
          companyId: token.companyId,
        });
        return;
      }
    }
  } else {
    throw new Error("Missing companyId in token data");
  }
}

/**
 * Creates location tokens by finding a company token (with locationId set to null)
 * and then calling getGHLToken with a Location payload.
 * 
 * @param location_id - The ID of the location.
 * @param company_id - The ID of the company.
 * @returns A promise that resolves to the location token data.
 * @throws An error if no company token is found.
 * @throws An error if the token update fails.
 */
export async function createLocationTokens(
  location_id: string,
  company_id: string
) {
  const db = admin.firestore();
  const tokensSnapshot = await db.collection('tokens')
    .where('locationId', '==', null)
    .limit(1)
    .get();
  if (tokensSnapshot.empty) {
    throw new Error("No company token found");
  }
  const tokenDoc = tokensSnapshot.docs[0];
  const tokenData = tokenDoc.data();
  const locationTokenPayload: Partial<Token> = {
    userType: 'Location',
    locationId: location_id,
    companyId: company_id,
  };
  return getGHLToken('', '', locationTokenPayload, tokenData.access_token);
}

/**
 * Verifies the given token by calling a protected GHL endpoint.
 */
export const verifyToken = async (token: string) => {
  const response = await fetch('https://api.gohighlevel.com/v1/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.ok;
};
