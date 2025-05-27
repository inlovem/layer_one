import { tokenService } from '../TokenService';
import { agencyService } from '../AgencyService';
import { userService } from '../UserService';
import { agencyOrchestrator } from './AgencyOrchestrator';
import { locationOrchestrator } from './LocationOrchestrator';
import { contactService } from '../ContactService';
import { anythingLLM } from '../AnythingLLMService';
import { userOrchestrator } from './UserOrchestrator';
import { UserIdWithWorkspace } from '../../types/llmTypes';
import { contactOrchestrator } from './ContactOrchestrator';
import { tokenRepos } from '../../repositories/TokenRepos';
import { TokenData } from '../../types/tokenTypes';
interface InstallationResult {
  companyId: string;
}

/**
 * InstallationOrchestrator handles the orchestration of installation and uninstallation
 * processes for companies and locations.
 */
export const installationOrchestrator = {

  /**
   * Processes the installation of a company and its locations
   * 
   * @param code - The authorization code from GHL
   * @returns Promise with the installation result containing the company ID
   */
  async processInstallation(code?: string, installData?:{ locationId: string, companyId: string, appId: string}): Promise<InstallationResult> {

    // GHL INSTALLATION from GHL Dashboard
    // Exchange code for tokens & metadata
    let companyToken: TokenData;
    
    if (code && code !== '') {
      companyToken = await tokenService.getGHLToken('authorization_code', code);
    // Install company-level resources if needed
      if (companyToken.userType === 'Company') {
        await agencyService.handleCompanyInstallation(companyToken);
      }
      if (!companyToken.companyId) {
        throw new Error('Company ID is required');
      }
    }

    // GHL INSTALLATION from GHL Webhook
    // Exchange code for tokens & metadata
    else if (installData) {
      const token = await tokenRepos.getToken(installData.companyId, 'Company');
      if (!token) {
        throw new Error('Company token not found');
      }
      companyToken = token as TokenData;
    } else {
      throw new Error('Either code or locationId with installData is required');
    }

    if (!companyToken) {
      throw new Error('Failed to obtain company token');
    }


    // Install locations
    const locationTokens = await locationOrchestrator.batchInstall(companyToken)
    console.log(`Installed ${locationTokens.length} locations for company ${companyToken.companyId}`);
    // Install users
    const usersWithLocations = await Promise.all(
      locationTokens.map(async locationToken => {
        const locationUsers = await userOrchestrator.installUsers(locationToken.access_token, locationToken.locationId);
        return {
          locationId: locationToken.locationId,
          users: locationUsers
        };
      })
    );

    // Install contacts
    await contactOrchestrator.installContacts(locationTokens);






    // LLM INSTALLATION

    // Create an array of UserIdWithWorkspace objects, one for each location
    const users: UserIdWithWorkspace[] = usersWithLocations.map(location => ({
      userId: location.locationId,
      id: location.users.map(user => user.id)
    }));

    // Install users in LLM
    await userOrchestrator.installUsersLLM(users);

    return { companyId: companyToken.companyId! };
  },


  /**
   * Process uninstallation for a location or company
   * 
   * @param payload - The webhook payload containing uninstallation data
   * @returns Promise that resolves when uninstallation is complete
   */
  async processUninstallation(payload: { type: string; companyId?: string; locationId?: string }): Promise<void> {
    this.validateUninstallationPayload(payload);
    const { companyId, locationId } = payload;

    try {
      if (locationId) {
        await this.executeUninstallation(locationId, 'locationId');
      } else if (companyId) {
        await this.executeUninstallation(companyId, 'companyId');
      } else {
        throw new Error('Missing locationId or companyId in uninstallation payload');
      }

      console.log('Uninstallation process completed successfully');
    } catch (error) {
      console.error('Error during uninstallation process:', (error as Error).message);
      throw error;
    }
  },

  /**
   * Validates the uninstallation payload
   * 
   * @param payload - The webhook payload to validate
   * @throws Error if the payload type is invalid
   */
  validateUninstallationPayload(payload: { type: string }): void {
    if (payload.type !== 'UNINSTALL') {
      throw new Error('Invalid uninstallation payload type');
    }
  },

  /**
   * Executes the uninstallation process for a location or company
   * 
   * @param id - The ID of the location or company to uninstall
   * @param type - The type of entity being uninstalled ('locationId' or 'companyId')
   */
  async executeUninstallation(id: string, type: 'locationId' | 'companyId'): Promise<void> {
    console.log(`Processing uninstallation for ${type === 'locationId' ? 'location' : 'company'} ${id}`);
    
    // Execute the appropriate orchestrator uninstall
    if (type === 'locationId') {
      await locationOrchestrator.uninstall(id);
    } else {
      await agencyOrchestrator.uninstall(id);
    }
    
    // Delete associated data
    const userIdList = await userService.getUserByLocationId(id);
    await userService.deleteUsers(id, type);
    await contactService.deleteContacts(id, type);
    
    // Handle AnythingLLM cleanup
    await anythingLLM.deleteUser(id, type);
    if (userIdList) {
      await anythingLLM.deleteBatchWorkspace(userIdList, type);
    }
   
  }
};