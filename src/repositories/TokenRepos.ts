import { AuthRes } from "../types/types";
import admin from '../utils/firebase';
import { Partial } from "@sinclair/typebox";
import { getEncryptionKey } from '../utils/cryptoKey';
import crypto from 'crypto';

const ALGO = 'aes-256-cbc';




export const tokenRepos = {

  /**
   * Updates (or creates) a token in Firestore based on the provided token data.
   * Tokens are stored with encryption for security.
   * 
   * @param token - The token data to update or create.
   * @throws An error if the companyId is missing in the token data.
   */
   async updateAccessToken(auth_res: Partial<AuthRes>) {
    if (!auth_res.companyId) {
      throw new Error("Missing companyId in token data");
    }

    // Remove traceId as it's not needed
    delete auth_res.traceId;

    const db = admin.firestore();
    const tokensRef = db.collection('tokens');

    // Encrypt sensitive token data
    const encryptedAccessToken = auth_res.access_token ? this.encryptData(auth_res.access_token) : "";
    const encryptedRefreshToken = auth_res.refresh_token ? this.encryptData(auth_res.refresh_token) : "";

    // Build base token document with encrypted tokens
    const tokenDoc = {
      access_token: encryptedAccessToken,
      token_type: auth_res.token_type || "",
      expires_in: auth_res.expires_in || 0,
      refresh_token: encryptedRefreshToken,
      scope: auth_res.scope || "",
      userType: auth_res.userType || "",
      companyId: auth_res.companyId,
      userId: auth_res.userId || "",
      locationId: auth_res.locationId || null || "",
      approvedLocations: auth_res.approvedLocations || [],
      createdAt: new Date(),
      updatedAt: new Date(),  
      encrypted: true // Flag to indicate tokens are encrypted
    };

    // Query for existing token
    const tokensQuerySnapshot = await tokensRef
      .where('companyId', '==', auth_res.companyId)
      .where('locationId', '==', tokenDoc.locationId)
      .limit(1)
      .get();

    if (!tokensQuerySnapshot.empty) {
      await tokensQuerySnapshot.docs[0].ref.set(tokenDoc, { merge: true });   // merge the full document
    } else {
      await tokensRef.add(tokenDoc);
    }
  },



   encryptData(data: string): string {
    const key = getEncryptionKey();   // may throw MissingKeyError
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGO, key, iv);
    const encrypted = Buffer.concat([
      cipher.update(data, 'utf8'),
      cipher.final()
    ]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  },



  decryptData(encryptedData: string): string {
    const key = getEncryptionKey();
    const [ivHex, dataHex] = encryptedData.split(':');
    if (!ivHex || !dataHex) {
      throw new Error('Malformed encrypted data');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(dataHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    return decrypted.toString('utf8');
  },
  /**
   * Removes a token from Firestore based on the company ID and user type.
   * 
   * @param companyId - The ID of the company whose token should be removed.
   * @param userType - The type of user ('Company' or 'Location').
   * @param locationId - Optional location ID, required when userType is 'Location'.
   * @returns A promise that resolves when the token is successfully removed.
   * @throws An error if the companyId is missing or if locationId is missing for Location tokens.
   */
  async removeToken(companyId: string, userType: 'Company' | 'Location', locationId?: string): Promise<void> {
    // If companyId is empty string and userType is Location, treat as a Location token
    const isLocationToken = (companyId === '' && userType === 'Location');
    
    if (!companyId && !isLocationToken) {
      throw new Error("Missing companyId for token removal");
    }

    if (userType === 'Location' && !locationId) {
      throw new Error("Missing locationId for Location token removal");
    }

    const db = admin.firestore();
    const tokensRef = db.collection('tokens');
    
    // Build query conditions
    let queryRef = tokensRef as FirebaseFirestore.Query;
    
    if (!isLocationToken) {
      queryRef = queryRef.where('companyId', '==', companyId)
                         .where('userType', '==', userType);
    } else {
      queryRef = queryRef.where('userType', '==', 'Location');
    }
    
    if (userType === 'Location' && locationId) {
      queryRef = queryRef.where('locationId', '==', locationId);
    }

    const tokensQuerySnapshot = await queryRef.get();
    
    if (tokensQuerySnapshot.empty) {
      console.log(`No ${userType} token found for companyId: ${companyId}${locationId ? `, locationId: ${locationId}` : ''}`);
      return;
    }

    // Delete all matching tokens
    const batch = db.batch();
    tokensQuerySnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Successfully removed ${tokensQuerySnapshot.size} ${userType} token(s) for companyId: ${companyId}${locationId ? `, locationId: ${locationId}` : ''}`);
  },

  /**
   * Retrieves and decrypts a token from Firestore.
   * 
   * @param companyId - The ID of the company whose token should be retrieved.
   * @param userType - The type of user ('Company' or 'Location').
   * @param locationId - Optional location ID, required when userType is 'Location'.
   * @returns The decrypted token data or null if not found.
   */
  async getToken(companyId: string, userType: 'Company' | 'Location', locationId?: string): Promise<Partial<AuthRes> | null> {
    if (!companyId) {
      throw new Error("Missing companyId for token retrieval");
    }

    const db = admin.firestore();
    const tokensRef = db.collection('tokens');
    
    let query = tokensRef.where('companyId', '==', companyId);
    
    // For Location tokens, we need both userType and locationId
    if (userType === 'Location') {
      if (!locationId) {
        throw new Error("Missing locationId for Location token retrieval");
      }
      query = query.where('userType', '==', 'Location')
                  .where('locationId', '==', locationId);
    } else {
      // For Company tokens, we just need userType
      query = query.where('userType', '==', 'Company');
    }

    try {
      const tokensQuerySnapshot = await query.limit(1).get();
      
      if (tokensQuerySnapshot.empty) {
        console.log(`No token found for ${userType} with companyId: ${companyId}${locationId ? `, locationId: ${locationId}` : ''}`);
        return null;
      }

      const tokenData = tokensQuerySnapshot.docs[0].data() as any;
      
      // Decrypt tokens if they're encrypted
      if (tokenData.encrypted) {
        if (tokenData.access_token) {
          tokenData.access_token = this.decryptData(tokenData.access_token);
        }
        if (tokenData.refresh_token) {
          tokenData.refresh_token = this.decryptData(tokenData.refresh_token);
        }
      }
      
      return tokenData as Partial<AuthRes>;
    } catch (error) {
      console.error(`Error retrieving token: ${error}`);
      throw error;
    }
  }

}