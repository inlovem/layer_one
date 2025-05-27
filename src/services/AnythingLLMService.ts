import axios from "axios";
import { User } from '../types/userTypes.js';
import {
  UserDTO,
  UserResponseDTO,
  WorkspaceDTO,
  WorkspaceResponseDTOList,
  WorkspaceResponseWithMessageDTO
} from "../types/dto";
import { makeRequest } from "../utils/axiosUtil";
import { UserIdWithWorkspace } from "../types/llmTypes";


export const anythingLLM = {
  /**
   * Adds a new user to the AnythingLLM system.
   * @param userId - The user ID to be used as the username and password for the new user.
   * @returns A promise that resolves to an object containing the user details or error information.
   */
  async addUser(userId: string): Promise<UserResponseDTO> {
    try {
      const url = `${process.env.ANYTHINGLLM_API_URL}/v1/admin/users/new`;
      const user: UserDTO = {
        username: String(userId).toLowerCase(), // Force string conversion
        password: String(userId), // Force string conversion
        role: "default"
      };
      console.log("user: ", user);
      const response = await makeRequest('POST', url, user);
      return response.data as UserResponseDTO;
    } catch (error: any) {
      console.error("Error adding user to AnythingLLM:", error.message);
      throw new Error(error.message);
    }
  },

  /**
   * Deletes a user from the AnythingLLM system.
   * @param userId - The ID of the user to be deleted.
   * @param type - The type of the user to be deleted.
   * @returns A promise that resolves to an object indicating the success of the operation and any error message.
   */
  async deleteUser(
    userName: string,
    type: 'locationId' | 'companyId'
  ): Promise<{ success: boolean; error?: string | null }> {
    try {

      const user = await this.findUserByLocationId(userName);
      if (!user) {
        return {
          success: false,
          error: "User not found"
        };
      }
      const url = `${process.env.ANYTHINGLLM_API_URL}/v1/admin/users/${user}`;
      await makeRequest('DELETE', url);
      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  },

  /**
   * Adds a new workspace for a user in the AnythingLLM system.
   * @param userId - The ID of the user for whom the workspace is being created.
   * @param type - The type of the user for whom the workspace is being created.
   * @param openAiPrompt - The OpenAI prompt to be used in the workspace.
   * @param queryRefusalResponse - The response to be used when a query is refused.
   * @returns A promise that resolves to a WorkspaceResponseDTO containing the workspace details.
   * @throws An error if the request to add the workspace fails.
   */
  async addWorkspace(
    userIds: string[],
    openAiPrompt: string,
    queryRefusalResponse: string
  ): Promise<string[]> {
    const url: string = `${process.env.ANYTHINGLLM_API_URL}/v1/workspace/new`;
    const workspaceIds: string[] = [];

    try {
      for (const userId of userIds) {
        const workspace = {
          name: userId.toLowerCase(),
          similarityThreshold: 0.7,
          openAiTemp: 0.7,
          openAiHistory: 20,
          openAiPrompt,
          queryRefusalResponse,
          chatMode: "chat",
          topN: 4,
        };

        const response = await makeRequest('POST', url, workspace);
        workspaceIds.push(response.data.workspace.name);
      }
    } catch (err: unknown) {
      const errorMessage = (err instanceof Error) ? err.message : 'Unknown error';
      console.error("Error adding workspace:", errorMessage);
      throw new Error(errorMessage);
    }

    return workspaceIds;
  },

  /**
   * Fetches the list of workspaces for a given user.
   * @param userId - The ID of the user whose workspaces are to be retrieved.
   * @returns A promise that resolves to a list of workspace response DTOs.
   * @throws An error if the request fails.
   */
  async fetchUserWorkspaces(userId: string): Promise<WorkspaceResponseDTOList> {
    const url: string = `${process.env.ANYTHINGLLM_API_URL}/v1/admin/workspaces/${userId}`;
    try {
      const response = await makeRequest('GET', url)
      return response.data as WorkspaceResponseDTOList;
    } catch (error) {
      console.error("Error fetching workspaces:", (error as Error).message);
      throw new Error((error as Error).message);
    }
  },


  /**
   * Deletes a workspace in the AnythingLLM system.
   * @param slug - The slug of the workspace to be deleted.
   * @returns A promise that resolves when the workspace is successfully deleted.
   * @throws An error if the request to delete the workspace fails.
   */
  async deleteBatchWorkspace(slugList: string[], 
    type: 'locationId' | 'companyId'): 
    Promise<void> {

    try {
      for (const slug of slugList) {
        const url: string = `${process.env.ANYTHINGLLM_API_URL}/v1/workspace/${slug.toLowerCase()}`;
        await makeRequest('DELETE', url);
        console.log(`Workspace with slug ${slug} deleted successfully.`); 
      }
    } catch (error) {
      console.error("Error deleting workspace:", (error as Error).message);
      throw new Error((error as Error).message);
    }
    return
  },

   /**
   * Finds a user by matching the locationId with username.
   * @param locationId - The location ID to match with username.
   * @returns A promise that resolves to the user ID if found, undefined otherwise.
   * @throws An error if the request to fetch users fails.
   */
   async findUserByLocationId(locationId: string): Promise<number | undefined> {
    if (!locationId) {
      throw new Error("Location ID is required");
    }
    
    try {
      const usersResponse = await this.getUsers();
      const normalizedLocationId = locationId.toLowerCase();
      
      const matchedUser = usersResponse.users.find(
        user => user.username.toLowerCase() === normalizedLocationId
      );
      
      return matchedUser?.id;
    } catch (error) {
      console.error("Error finding user by location ID:", (error as Error).message);
      throw new Error((error as Error).message);
    }
  },

  /**
   * Fetches all users from the AnythingLLM system.
   * @returns A promise that resolves to a list of users.
   * @throws An error if the request fails.
   */
  async getUsers(): Promise<{ users: Array<{ id: number; username: string; role: string }> }> {
    const url: string = `${process.env.ANYTHINGLLM_API_URL}/v1/users`;
    try {
      const response = await makeRequest('GET', url);
      return response.data as { users: Array<{ id: number; username: string; role: string }> };
    } catch (error) {
      console.error("Error fetching users:", (error as Error).message);
      throw new Error((error as Error).message);
    }
  },

 


async assignWorkspaceToUsers(assignments: { llmUserId: string; workspaceId: string }[]): Promise<void> {
    for (const {llmUserId, workspaceId} of assignments) {

        console.log("llmUserId: ", llmUserId);
        console.log("workspaceId: ", workspaceId);
        const url: string = `${process.env.ANYTHINGLLM_API_URL}/v1/admin/workspaces/${workspaceId.toLowerCase()}/manage-users`;
        const payload = {
            userIds: [llmUserId],
            reset: false,
        };
        console.log("payload: ", payload);
        await makeRequest('POST', url, payload);
    }   
}
};
export default anythingLLM;
