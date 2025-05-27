import { locationService } from "../LocationService";
import { FastifyError } from "fastify";
import { TokenData } from "../../types/tokenTypes";
import { LocationWithToken, CreateLocationDTO, UpdateLocationDTO, InstallParams, Location as GHLLocation } from "../../types/locationTypes";



/**
 * Service (orchestrator) for location operations.
 * Contains business logic and delegates persistence to locationService.
 */
export const locationOrchestrator = {

    async create(dto: CreateLocationDTO) {
      if (!dto.companyId || !dto.name) {
        const err = new Error("Company ID and name are required");
        (err as FastifyError).statusCode = 400;
        throw err;
      }
      return await locationService.createLocation(dto.companyId, dto);
    },
  
    async update(id: string, dto: UpdateLocationDTO) {
      if (!id || !dto.companyId || !dto.name) {
        const err = new Error("Location ID, company ID, and name are required");
        (err as FastifyError).statusCode = 400;
        throw err;
      }
      return await locationService.updateLocation(id, dto);
    },
  
    async install(id: string, params: InstallParams) {
      if (!id || !params.companyId || !params.appId) {
        const err = new Error("Location ID, company ID, and app ID are required");
        (err as FastifyError).statusCode = 400;
        throw err;
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
      return await locationService.installLocation(id, params);
    },


    async batchInstall(companyToken: TokenData): Promise<LocationWithToken[]> {
      console.log(`Installing locations for company and installing tokens ${companyToken.companyId}`);
      const locationsInDB = await this.installLocations(companyToken);
      // Process each location individually
      console.log(`BATCH INSTALL locationsInDB: ${locationsInDB}`);
      let locationsWithTokens = [];
      for (const location of locationsInDB) {
          // Debug the location data
          locationsWithTokens.push(await this.createLocationTokens(location._id, companyToken));
      }
      console.log(`BATCH INSTALL locationsWithTokens: ${locationsWithTokens}`);
      return locationsWithTokens;
    },

    async uninstall(id: string) {
      if (!id) {
        const err = new Error("Location ID is required");
        (err as FastifyError).statusCode = 400;
        throw err;
      }
      await locationService.uninstallLocation(id);
    },

    /**
     * Processes the batch installation of all default locations for a company.
     * 
     * @param companyToken - The company token data
     */

    async installLocations(companyToken: TokenData) {
      // Fetch already installed locations from the database

      const locations = await locationService.getLocations(
        companyToken.access_token, 
        companyToken.companyId, 
        process.env.GOHL_APP_ID!
      );


      console.log(`locations id: ${locations.map(location => location._id)}`);
      console.log(`locations name: ${locations.map(location => location.name)}`);
      console.log(`locations isInstalled: ${locations.map(location => location.isInstalled)}`);
      console.log(`locations trial: ${locations.map(location => location.trial)}`);



      await locationService.saveLocations(locations, companyToken.companyId);
      return locations;
      // const installedLocationsInDB = await locationRepos.getInstalledLocationsByCompanyId(companyToken.companyId);
      // Provision all locations from GHL
     
    //   let locationsInDB: GHLLocation[] = [];
    //   //compare the locations in GHL with the locations in the database
    //   if (installedLocationsInDB.length < 1) {
    //   locationsInDB = await locationService.compareLocations(locationsInGHL, installedLocationsInDB);
    //     if (locationsInDB.length > 0) {
    //       await locationService.saveLocations(locationsInDB, companyToken.companyId);
    //   }
    // }
     
      // return locationsInDB;
    },

  /**
   * Processes a single location installation
   * 
   * @param locationId - The ID of the location to process
   * @param companyToken - The company token data
   * @returns Promise with an object containing the location ID and access token
   */
  async createLocationTokens(locationId: string, companyToken: TokenData): Promise<LocationWithToken> {
    // Create tokens for the location
    const locationTokenResponse = await locationService.createTokensForLocation(
      companyToken.companyId, 
      companyToken.access_token,
      locationId
    );
    // Skip if no access token is available
    if (!locationTokenResponse.data?.access_token) {
      console.warn(`No access token available for location: ${locationId}`);
      throw new Error(`No access token available for location: ${locationId}`);
    }
    return {locationId: locationId, access_token: locationTokenResponse.data.access_token,};
  },
};