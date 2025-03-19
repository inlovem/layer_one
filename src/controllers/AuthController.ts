// src/controllers/AuthController.ts

import axios from 'axios';
import CryptoJS from 'crypto-js';
import {  updateUserController } from './UserController';
import {Token } from "../types/types.js";
import { prisma } from "../utils/prismaClient.js";
import { Partial } from "@sinclair/typebox";
import jwt from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from "fastify";


/**
  * Handles the initial installation of the application by exchanging an authorization code for a token.
  * @param request
  * @param reply 
  * @returns Promise<void>
 */

export async function handleInitialInstall( 
  request: FastifyRequest<{ Body: {code: string;} }>,
  reply: FastifyReply) {
    try {
      const { code } = request.body;
      const companyTokenData = await getGHLToken('authorization_code', code, undefined, '')

      if (!companyTokenData || !companyTokenData.companyId || !companyTokenData.access_token) {
        throw new Error('Missing companyId or access_token from the company token data!')
      }
  
      // Fetch location tokens
      await attemptFetchLocationToken(companyTokenData.companyId, companyTokenData.access_token)
      
    } catch (error) {
      console.error("Token exchange error:", error);
      return reply.status(500).send({
        error: "Failed to exchange code for token",
      });
    }
}

/**
 * Validates the SSO token and creates a JWT for the user.
 * @param request - The Fastify request object.
 * @param reply - The Fastify reply object.
 */

export const validateSsoController = async (
  request: FastifyRequest<{ Body: { ssoToken: string } }>,
  reply: FastifyReply): 
  Promise<void> => {
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
    } 
    catch (error) {
      console.error("SSO Decryption error:", error);
      return reply.status(401).send({
        error: "Invalid SSO token",
      });
  } 
}

/**
 * Creates a JWT for the user.
 * @param userData - The user data object.
 * @returns The generated JWT as a string.
 */

const createJwtForUser = (
  userData: any): string => {

  const JWT_SECRET = process.env.JWT_SECRET || ''
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
 */
async function decryptSSO(
  encryptedToken: string): 
  Promise<any> {
  
  const SSO_KEY = process.env.GHL_SSO_KEY || '';

  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, SSO_KEY);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) {
      throw new Error('Decryption returned an empty string. Possibly bad key or format mismatch.');
    }
    
    const userData = JSON.parse(decryptedText);
    console.log('Decrypted user data:', userData);
    // Update user in the database
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

    const searchHistory = updatedUser.searchHistory || [];
    return {...userData, searchHistory};
  } catch (error) {
    console.error('Failed to decrypt SSO token:', error);
    throw new Error('Failed to decrypt SSO token');
  }
}


export async function attemptFetchLocationToken(
  companyId: string,
  access_token: string,
  retriesLeft = 3
) {
  try {
     await getLocationTokens(companyId, access_token)
  } catch (err) {
    if (retriesLeft <= 1) {
      console.error(`Location token final fail:`, err)
      return
    }
    console.warn(`Retrying location token`)
    // Wait 1min before next attempt
    setTimeout(
      () => attemptFetchLocationToken(companyId, access_token, retriesLeft - 1),
      60_000
    )
  }
}

async function getLocationTokens(
  companyId: string, 
  access_token?: string): 
  Promise<any> {  

  const locations = await prisma.location.findMany({
    where: { companyId: companyId },
    select: { locationId: true },
  })

  await Promise.all(
    locations.map(async (loc : any) => {
      try {
        const locationTokenPayload: Partial<Token> = {
          userType: 'Location',
          locationId: loc.locationId || '',
          companyId: companyId,
          access_token: access_token || '',
        }
        const locTokenData = await getGHLToken('', '', locationTokenPayload, access_token)
        console.log(`✔️ Location token fetched for locationId=${loc.locationId}`, locTokenData)
      } catch (err) {
        console.error(`❌ Failed to fetch location token for locationId=${loc.locationId}`, err)
      }
    }),
  )
}



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
      await updateAccessToken(data);
      return data;
    } catch (error) {
      throw error;
    }
  } else {
    const encodedParams = new URLSearchParams({
      client_id: process.env.GOHL_CLIENT_ID!,
      client_secret: process.env.GOHL_CLIENT_SECRET!,
      grant_type: grant_type,
      code: code || '',
      refresh_token: token ? token.refresh_token || '' : '',
      redirect_uri: '', 
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
    } catch (error) {
      throw error;
    }
  }
};


async function updateAccessToken(token: Partial<Token>) {
  delete token.traceId;
  if (token.companyId) {
    if (token.locationId) {
      const existingToken = await prisma.token.findFirst({
        where: {
          companyId: token.companyId,
          locationId: token.locationId,
        },
      });
      if (existingToken) {
        return await prisma.token.update({
          where: { id: existingToken.id },
          data: { ...token },
        });
      } else {
        return await prisma.token.create({
          data: {
            access_token: token.access_token || "",
            token_type: token.token_type!,
            expires_in: token.expires_in || 0,
            refresh_token: token.refresh_token || "",
            userId: token.userId || "",
            approvedLocations: token.approvedLocations || [],
            scope: token.scope || "",
            userType: token.userType || "",
            locationId: token.locationId,
            companyId: token.companyId,
          },
        });
      }
    } else {
   
      const existingToken = await prisma.token.findFirst({
        where: {
          companyId: token.companyId,
          locationId: null,
        },
      });
      if (existingToken) {
        return await prisma.token.update({
          where: { id: existingToken.id },
          data: { ...token },
        });
      } else {
        return await prisma.token.create({
          data: {
            access_token: token.access_token || "",
            token_type: token.token_type!,
            expires_in: token.expires_in || 0,
            refresh_token: token.refresh_token || "",
            userId: token.userId || "",
            approvedLocations: token.approvedLocations || [],
            scope: token.scope || "",
            userType: token.userType || "",
            locationId: null,
            companyId: token.companyId,
          },
        });
      }
    }
  } else {
    throw new Error("Missing companyId in token data");
  }
}


export async function createLocationTokens(
  location_id: string, 
  company_id: string) {

  const token = await prisma.token.findFirst({
    where: {
      locationId: null,
    },
  });
  if (!token) {
    throw new Error("No company token found");
  }
  const locationTokenPayload: Partial<Token> = {
    userType: 'Location',
    locationId: location_id,
    companyId: company_id

  };
  return getGHLToken('', '', locationTokenPayload, token.access_token);
}


/**
 * Verifies the given token by calling a protected GHL endpoint.
 */
export const verifyToken = async (
  token: string) => {

  const response = await fetch('https://api.gohighlevel.com/v1/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.ok;
};


// async function getAccessToken(companyId: string, locationId?:string, userType? : string ):Promise<String | null> {
//   let whereCondition = {
//     companyId: companyId,
//     locationId: locationId || null,
//     userType: userType
//   };
//   const token = await prisma.token.findFirst({
//     where: whereCondition,
//   })
//   if (!token) {
//     return null;
//   }
//   return token?.access_token || null;
// }










