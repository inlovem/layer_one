import { userService } from '../UserService';
import { UserInput } from '../../types/userTypes';

/**
 * UserOrchestrator handles the orchestration of user-related operations
 * including creation, updates, and management of user data across the system.
 */
export const userOrchestrator = {
  /**
   * Upserts a user in the system based on webhook data
   * 
   * @param userData - User data from webhook
   * @returns Promise that resolves when the user is upserted
   */
  async upsert(userData: {
    id: string;
    locationId?: string;
    companyId?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    extension?: string;
    role?: string;
    permissions?: Record<string, boolean>;
    type: string;
    locations?: string[];
  }): Promise<string> {
    try {
      console.log(`Processing ${userData.type} for user ${userData.id}`);
      
      // Prepare user input data
      const userInput: UserInput = {
        id: userData.id,
        userId: userData.id, // Ensure userId is set for compatibility
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone || '',
        extension: userData.extension,
        role: userData.role,
        permissions: userData.permissions,
        updatedAt: new Date(),
      };
      
      // Handle location-specific vs company-level users
      if (userData.locationId) {
        userInput.locationId = userData.locationId;
      }
      
      if (userData.companyId) {
        userInput.companyId = userData.companyId;
      }
      
      // If locations array is provided, store it
      if (userData.locations && userData.locations.length > 0) {
        userInput.locationIds = userData.locations;
      }
      
      // Upsert the user in the database
      const userId = await userService.upsertUser(userInput);
      console.log(`Successfully upserted user ${userId}`);
      
      return userId;
    } catch (error: any) {
      console.error(`Error in userOrchestrator.upsert:`, error);
      throw new Error(`Failed to upsert user: ${error.message}`);
    }
  }
};
