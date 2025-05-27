import { userService } from '../UserService';
import { User, UserInput } from '../../types/userTypes';
import { anythingLLM } from '../AnythingLLMService';
import { contactService } from '../ContactService';
import { UserIdWithWorkspace } from '../../types/llmTypes';

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
  },

  /**
   * Installs users for a given location
   * 
   * @param accessToken - The access token for the location
   * @returns Promise that resolves when the users are installed
   */
  async installUsers(accessToken: string, locationId: string) {
    const users = await userService.fetchUsers(
      accessToken,
      locationId
    );

    await userService.saveUsersBatch(users, locationId);
    return users;
  },

  async installUsersLLM(users : UserIdWithWorkspace[]) {
    let usersWithLLMId = [];
    for (const user of users) {
      const userWithLLMId = await anythingLLM.addUser(user.userId);
      usersWithLLMId.push({
        llmUserId: userWithLLMId.user.id,
        workspaceId: user.id
      });
    }

    console.log("usersWithLLMId: ", usersWithLLMId);

    await anythingLLM.addWorkspace(usersWithLLMId.flatMap(user => user.workspaceId), "default", "default");

    
    const assignments = usersWithLLMId.flatMap(({ llmUserId, workspaceId }) =>
      workspaceId.map(wsId => ({
        llmUserId: String(llmUserId),  
        workspaceId: wsId
      }))
    );

    if (assignments.length > 0) {
      await anythingLLM.assignWorkspaceToUsers(assignments);
    }
  },

};
