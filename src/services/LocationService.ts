import axios from 'axios';
import admin from '../utils/firebase';
import { AuthRes } from '../types/types';
import { tokenService } from './TokenService';
import { locationRepos } from '../repositories/LocationRepos';
import { tokenRepos } from '../repositories/TokenRepos';


// Location Service
export const locationService = {
    /**
     * Creates tokens for all locations associated with a company.
     */
    async createTokensForLocation(
      companyId: string,
      companyAccess: string,
      locationId: string
    ) {

      if (!companyId || !companyAccess || !locationId) {
        throw new Error('Company ID, access token, and location ID are required');
      }
      
      try {
        const tokenData = await tokenService.getGHLToken(
          '', // grant_type unused for location call
          '',
          { userType: 'Location', locationId, companyId },
          companyAccess
        );
        console.log(`✔︎ Location token created for ${locationId}`);
        return { locationId, success: true, data: tokenData };
      } catch (err: any) {
        const msg =
          err.response?.data?.message || err.message || 'unknown reason';
        console.warn(`↳ Failed to create token for ${locationId}: ${msg}`);
        return { locationId, success: false, error: msg };
      }
    },
    
    /**
     * Fetches all locations for the given company from the GHL API.
     */
    async getLocations(access_token: string, companyId: string, appId: string) {
      if (!access_token || !companyId || !appId) {
        throw new Error('Access token, company ID, and app ID are required');
      }
      console.log('📥 Fetching locations for companyId:', companyId)
      console.log('📥 Using appId:', appId);
      console.log('📥 Using access_token:', access_token);
  
      interface Location {
        _id: string;        // Location ID (e.g., "0IHuJvc2ofPAAA8GzTRi")
        name: string;       // Name of the location (e.g., "John Deo")
        address: string;    // Address linked to location (e.g., "47 W 13th St, New York, NY 10011, USA")
        isInstalled: boolean; // Check if the requested app is installed for this location
      }
      
      interface LocationsResponse {
        locations: Location[];
        count: number;      // Total location count under the company
        installToFutureLocations: boolean | null; // Controls if app is automatically installed to future locations
        traceId: string;
      }
      
      let allLocations: LocationsResponse = { 
        locations: [], 
        count: 0, 
        installToFutureLocations: null, 
        traceId: '' 
      };
      let hasMore = true;
      let limit = 100;
      let skip = 0;
  
      while (hasMore) {
        const queryParams = new URLSearchParams({
          companyId: companyId,
          appId: appId,
          limit: limit.toString(),
          skip: skip.toString()
        });
    
        const options = {
          method: 'GET',
          url: `https://services.leadconnectorhq.com/oauth/installedLocations?${queryParams.toString()}`,
          headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: 'application/json',
            Version: '2021-07-28',
          },
        };
        
        try {
          const response = await axios.request<LocationsResponse>(options);
          if (!response.data) {
            throw new Error('Invalid response data format');
          }
          
          // Filter to only include locations where isInstalled is true
          const installedLocations = response.data.locations.filter(location => location.isInstalled);
          
          // Merge the installed locations with the existing ones
          allLocations.locations = [...allLocations.locations, ...installedLocations];
          allLocations.count = response.data.count;
          allLocations.installToFutureLocations = response.data.installToFutureLocations;
          allLocations.traceId = response.data.traceId;
          
          // Check if we need to fetch more locations
          if (response.data.locations.length < limit) {
            hasMore = false;
          } else {
            skip += limit;
          }
          
          console.log(`📥 Fetched ${installedLocations.length} installed locations out of ${response.data.locations.length}, total installed so far: ${allLocations.locations.length}`);
          
        } catch (error: any) {
          console.error('Error fetching locations:', error.message);
          throw error; // bubble up for visibility
        }
      }
      
      // Save all locations in a separate function
      await this.saveLocations(allLocations, companyId);
      return allLocations;
    },
    /**
     * Saves locations data to the database
     */
    async saveLocations(locationsData: any, companyId: string) {
      try {
        await locationRepos.updateLocations(locationsData, companyId);
      } catch (error: any) {
        console.error('Error saving locations:', error.message);
        throw error;
      }
    },
  
    /**
     * Attempts to fetch tokens for all locations related to a given company with retries.
     */
    async attemptFetchLocationToken(
      companyId: string,
      access_token: string,
      retriesLeft = 3
    ) {
      try {
        await this.getLocationTokens(companyId, access_token);
      } catch (err) {
        if (retriesLeft <= 1) {
          console.error(`Location token final fail:`, err);
          return;
        }
        console.warn(`Retrying location token`);
        // Wait 1 minute before retrying
        setTimeout(() => this.attemptFetchLocationToken(companyId, access_token, retriesLeft - 1), 60_000);
      }
    },
  
    /**
     * Fetches tokens for all locations associated with a company.
     */
    async getLocationTokens(companyId: string, access_token?: string): Promise<any> {
      if (!companyId) {
        throw new Error('Company ID is required');
      }
      
      // Get installed locations from repository instead of direct Firestore access
      const installedLocations = await locationRepos.getInstalledLocationsByCompanyId(companyId);
      
      if (installedLocations.length === 0) {
        console.log(`No installed locations found for company ${companyId}`);
        return [];
      }
      
      const results: { locationId: string; success: boolean; data?: any; error?: string }[] = [];
      
      await Promise.all(
        installedLocations.map(async (loc: any) => {
          const locationId = loc.id || loc.locationId || '';
          
          if (!locationId) {
            console.warn(`Skipping location with missing ID for company ${companyId}`);
            results.push({ locationId, success: false, error: 'Missing location ID' });
            return;
          }
          
          try {
            const locationTokenPayload: Partial<AuthRes> = {
              userType: 'Location',
              locationId: locationId,
              companyId: companyId,
              access_token: access_token || '',
            };
            
            const locTokenData = await tokenService.getGHLToken('', '', locationTokenPayload, access_token);
            console.log(`✔️ Location token fetched for locationId=${locationId}`);
            results.push({ locationId, success: true, data: locTokenData });
          } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'unknown error';
            console.error(`❌ Failed to fetch location token for locationId=${locationId}: ${errorMessage}`);
            results.push({ locationId, success: false, error: errorMessage });
          }
        })
      );
      
      return results;
    },
  
    /**
     * Creates a new location in the database.
     * 
     * @param locationId - The ID of the location to create
     * @param locationData - The location data to store
     */
    async createLocation(locationId: string, locationData: {
      companyId: string;
      name: string;
      email: string;
      stripeProductId: string;
      appId: string;
    }): Promise<void> {
      if (!locationId) {
        throw new Error('Location ID is required');
      }
      
      if (!locationData.companyId || !locationData.appId) {
        throw new Error('Company ID and App ID are required');
      }
      
      await locationRepos.createLocation(locationId, locationData);
      console.log(`Location created: ${locationId}`);
    },

    /**
     * Updates an existing location in the database.
     * 
     * @param locationId - The ID of the location to update
     * @param locationData - The location data to update
     */
    async updateLocation(locationId: string, locationData: {
      companyId: string;
      name: string;
      email: string;
      stripeProductId: string;
      appId: string;
    }): Promise<void> {
      if (!locationId) {
        throw new Error('Location ID is required');
      }
      
      if (!locationData.companyId || !locationData.appId) {
        throw new Error('Company ID and App ID are required');
      }
      
      const db = admin.firestore();
      await db.collection('locations').doc(locationId).update({
        ...locationData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Location updated: ${locationId}`);
    },

    /**
     * Installs a location by creating or updating its record.
     * 
     * @param locationId - The ID of the location to install
     * @param installData - Basic installation data
     */
    async installLocation(locationId: string, installData: {
      companyId: string;
      appId: string;
    }): Promise<void> {
      if (!locationId) {
        throw new Error('Location ID is required');
      }
      
      if (!installData.companyId || !installData.appId) {
        throw new Error('Company ID and App ID are required for installation');
      }
      
      await locationRepos.installLocation(locationId, installData);
    },

    /**
     * Uninstalls a location by marking it as uninstalled.
     * 
     * @param locationId - The ID of the location to uninstall
     */
    async uninstallLocation(locationId: string): Promise<void> {
      if (!locationId) {
        throw new Error('Location ID is required');
      }
      
      await locationRepos.uninstallLocation(locationId);
      await tokenRepos.removeToken('', 'Location', locationId);
    },

    
    /**
     * Creates location tokens by finding a company token and then calling getGHLToken with a Location payload.
     * 
     * @param companyId - The ID of the company
     * @param locationId - The ID of the location
     * @returns Promise with the token data
     */
    async createLocationTokens(
      companyId: string,
      locationId: string
    ) {
      if (!companyId || !locationId) {
        throw new Error('Company ID and Location ID are required');
      }
      
      try {
        return await locationRepos.createLocationTokens(locationId, companyId);
      } catch (error: any) {
        console.error(`Failed to create location token for locationId=${locationId}: ${error.message}`);
        throw error;
      }
    },


  }

