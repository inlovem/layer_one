import axios from 'axios';
import { userRepos } from '../repositories/UserRepos';
import { User, UsersResponse, UserInput } from '../types/userTypes';
import { WorkspaceResponseWithMessageDTO } from '../types/dto/WorkspaceDTO';
import { UserResponseDTO } from '../types/dto/UserDTO.js';
export const userService = {
  /**
   * Fetches users for a specific location and saves them to the database
   * 
   * @param access_token - The access token for API authentication
   * @param locationId - The ID of the location to fetch users for
   * @param companyId - The ID of the company the location belongs to
   * @param addWorkspace - Optional callback function to create a workspace for the location
   * @returns The list of users fetched from the API
   */
  async fetchUsers(
    access_token: string,
    locationId: string
  ): Promise<User[]> {

    try {
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
      const usersToSave = data.users.map(u => ({
        userData: u,
        userId: u.id  // GHl user Id well use in our db
      }));
  
      return usersToSave.map(user => user.userData) as User[];

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
   * Saves a batch of users to the database
   * 
   * @param users - The list of users to save
   * @param locationId - The ID of the location the users belong to
   * @param companyId - The ID of the company the location belongs to 
   */
  async saveUsersBatch(users: User[], locationId: string): Promise<void> {
    await userRepos.saveUsersBatch(users, { locationId});
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
  },

  async getUserByLocationId(locationId: string): Promise<string[] | null> {
    try {
      return await userRepos.getUsersByLocationId(locationId);
    } catch (error: any) {
      console.error(`Error getting user by locationId:`, error.message);
      throw error;
    }
  },

};
