import CryptoJS from 'crypto-js';
import { updateUserController } from '../controllers/UserController';


// SSO Service
export const ssoService = {
  /**
   * Helper function that decrypts the SSO token using CryptoJS.
   */
  async decryptSSO(encryptedToken: string): Promise<any> {
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
};