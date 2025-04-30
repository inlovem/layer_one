// src/services/InstallationService.ts
import { tokenService } from '../TokenService';
import { agencyService } from '../AgencyService';
import { locationService } from '../LocationService';
import { userService } from '../UserService';
import { agencyOrchestrator } from './AgencyOrchestrator';
import { locationOrchestrator } from './LocationOrchestrator';
import { contactService } from '../ContactService';

interface InstallationResult {
  companyId: string;
  // any other info you need to return
}


export const installationOrchestrator = {
  async processInstallation(code: string): Promise<InstallationResult> {
    // 1. Exchange code for tokens & metadata
    const companyToken = await tokenService.getGHLToken('authorization_code', code);
  
    // 2. Install company-level resources if needed
    if (companyToken.userType === 'Company') {
      await agencyService.handleCompanyInstallation(companyToken);
    }
    // 3. Provision all default locations
    const locations = await locationService.getLocations(
      companyToken.access_token, 
      companyToken.companyId, 
      process.env.GOHL_APP_ID!
    );

    // Process each location individually
    for (const location of locations.locations) {
      if (location.isInstalled) {
        console.log(`Processing installed location: ${location._id}`);
        // Create tokens for the location
        const locationTokenResponse = await locationService.createTokensForLocation(
          companyToken.companyId, 
          companyToken.access_token,
          location._id
        );

        // If the location has an access token, fetch and save users
        if (locationTokenResponse.data?.access_token) {
          console.log(`Fetching users for location: ${location._id}`);
          await userService.fetchAndSaveUsers(
            locationTokenResponse.data.access_token,
            location._id,
            companyToken.companyId,
          );
            // fetch and save contacts
          await contactService.fetchAndSaveContacts(
            locationTokenResponse.data.access_token,
            location._id
        );
        }


      }

    }

    return { companyId: companyToken.companyId! };
  },


  /**
   * Process uninstallation for a location or company
   * 
   * @param payload - The webhook payload containing uninstallation data
   * @returns Promise that resolves when uninstallation is complete
   */
  async processUninstallation(payload: any): Promise<void> {
    const { type, companyId, locationId } = payload;
    
    if (!type || type !== 'UNINSTALL') {
      throw new Error('Invalid uninstallation payload type');
    }
    
    try {
      // Handle location-specific uninstallation
      if (locationId) {
        console.log(`Processing uninstallation for location ${locationId}`);
        await locationOrchestrator.uninstall(locationId);
      } 
      // Handle company-level uninstallation
      else if (companyId) {
        console.log(`Processing uninstallation for company ${companyId}`);
        await agencyOrchestrator.uninstall(companyId);
      } else {
        throw new Error('Missing locationId or companyId in uninstallation payload');
      }
      // Delete all users and location contancts for the location
      if (locationId) {
        await userService.deleteUsers(locationId, 'locationId');
        await contactService.deleteContacts(locationId, 'locationId');
      } else if (companyId) { 
        await userService.deleteUsers(companyId, 'companyId');
        await contactService.deleteContacts(companyId, 'companyId');
      }
      
      
      
      console.log('Uninstallation process completed successfully');
    } catch (error: any) {
      console.error('Error during uninstallation process:', error.message);
      throw error;
    }
  },

  
};