import axios from 'axios';
import { userRepos } from '../repositories/UserRepos';
import { User, UsersResponse, UserInput } from '../types/userTypes';

export const userService = {
  /**
   * Fetches users for a specific location and saves them to the database
   * 
   * @param locationId - The ID of the location to fetch users for
   * @param companyId - The ID of the company the location belongs to
   * @returns The list of users fetched from the API
   */
  async fetchAndSaveUsers(
    access_token: string,
    locationId: string,
    companyId: string
  ): Promise<User[]> {
    if (!locationId || !companyId) {
      throw new Error('Location ID and Company ID are required');
    }
  
    try {
      // Fetch users from the GHL API
      const options = {
        method: 'GET',
        url: 'https://services.leadconnectorhq.com/users/',
        params: { locationId },
        headers: {
          Authorization: `Bearer ${access_token}`,
          Version: '2021-07-28',
          Accept: 'application/json'
        }
      };
      const { data } = await axios.request<UsersResponse>(options);
  
      if (!data?.users) {
        throw new Error('Invalid response format from users API');
      }
      console.log(`Fetched ${data.users.length} users for location ${locationId}`);
  
      // Transform into the shape your batch helper expects
      const usersToSave = data.users.map(u => ({
        userData: u,
        userId: u.id  // or whatever field on the GHL user object uniquely identifies them
      }));
  
      // Now call your batch helper
      await userRepos.saveUsersBatch(usersToSave, { locationId, companyId });
  
      return data.users;
    } catch (error: any) {
      console.error(`Error fetching users for location ${locationId}:`, error.message);
      throw error;
    }
  },

  /**
   * Saves users to the database
   * 
   * @param users - The list of users to save
   * @param locationId - The ID of the location the users belong to
   * @param companyId - The ID of the company the location belongs to
   */
  async saveUsers(users: User[], locationId: string, companyId: string): Promise<void> {
    try {
      // Add locationId and companyId to each user
      const enrichedUsers = users.map(user => ({
        ...user,
        locationId,
        companyId,
        updatedAt: new Date()
      }));

      // Save users to the database using the repository
      await userRepos.saveUsers(enrichedUsers, companyId, locationId);
      console.log(`Successfully saved ${users.length} users for location ${locationId}`);
    } catch (error: any) {
      console.error(`Error saving users for location ${locationId}:`, error.message);
      throw error;
    }
  },
 
  /**
   * Creates or updates a user in the database
   * 
   * @param userData - The user data to save
   * @returns The ID of the created/updated user
   */
  async upsertUser(userData: UserInput): Promise<string> {
    try {
      return await userRepos.upsertUser(userData);
    } catch (error: any) {
      console.error('Error upserting user:', error.message);
      throw error;
    }
  },

  /**
   * Retrieves a user by ID, userId, or email
   * 
   * @param identifier - The ID, userId, or email of the user to retrieve
   * @param identifierType - The type of identifier ('id', 'userId', or 'email')
   * @returns The user data or null if not found
   */
  async getUser(identifier: string, identifierType: 'id' | 'userId' | 'email' = 'id'): Promise<any | null> {
    try {
      return await userRepos.getUser(identifier, identifierType);
    } catch (error: any) {
      console.error(`Error getting user by ${identifierType}:`, error.message);
      throw error;
    }
  },

  /**
   * Deletes all users for a specific location or company
   * 
   * @param identifier - The ID of the location or company to delete users for
   * @param type - Optional parameter to specify if deleting by 'locationId' or 'companyId'
   */
  async deleteUsers(identifier: string, type: 'locationId' | 'companyId' = 'locationId'): Promise<void> {
    try {
      await userRepos.deleteUsers(identifier, type);
    } catch (error: any) {
      console.error(`Error deleting users for ${type} ${identifier}:`, error.message);
      throw error;
    }
  }
};
