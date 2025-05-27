import { AuthRes } from "../types/types";
import admin from '../utils/firebase';
import { Partial } from "@sinclair/typebox";
import { tokenService } from '../services/TokenService';
import { Location as GHLLocation } from '../types/locationTypes';


/**
 * Updates the locations in the database
 * 
 * @param locationsData - The locations data
 * @param companyId - The company ID
 * @param appId - The app ID
 */

export const locationRepos = {

  /**
   * Updates the locations in the database
   * 
   * @param locationsData - The locations data
   * @param companyId - The company ID
   * @param appId - The app ID
   */
  async updateLocations(
    locations: GHLLocation[],
    companyId: string
): Promise<void> {

  console.log(`Updating locations for company, ${locations} locations`);
  const db = admin.firestore();
  const locationsRef = db.collection('locations');
  const companyLocationsRef = db.collection('companies').doc(companyId).collection('locations');

  // Save each location as a separate document
  for (const location of locations) {
    // Only process locations where isInstalled is true
    if (!location.isInstalled) {
      continue;
    }
    const locationData = {
      ...location,
      companyId,
      isInstalled: true, // Ensure isInstalled is set to true
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Save location data to top-level locations collection
    await locationsRef.doc(location._id).set(locationData);
    // Also save location data to the company's locations subcollection
    await companyLocationsRef.doc(location._id).set(locationData);
  }
},

/**
 * Gets all installed locations for a specific company
 * 
 * @param companyId - The ID of the company
 * @returns Array of location documents
 */
async  getInstalledLocationsByCompanyId(companyId: string): Promise<GHLLocation[]> {
  const db = admin.firestore();
  const locDocs = await db
    .collection('locations')
    .where('companyId', '==', companyId)
    .where('isInstalled', '==', true)        // ← skip locations not bound to the app
    .get();
  
  console.log(`locDocs: ${locDocs}`);

  if (locDocs.empty) {
    return [];
  }

  return locDocs.docs.map(doc => ({
    _id: doc.id,
    ...doc.data()
  } as GHLLocation));
},



  /**
     * Creates location tokens by finding a company token and then calling getGHLToken with a Location payload.
     */
  async createLocationTokens(
    location_id: string,
    company_id: string
  ) {
    const db = admin.firestore();
    const tokensSnapshot = await db.collection('tokens')
      .where('locationId', '==', null)
      .limit(1)
      .get();
    if (tokensSnapshot.empty) {
      throw new Error("No company token found");
    }
    const tokenDoc = tokensSnapshot.docs[0];
    const tokenData = tokenDoc.data();
    const locationTokenPayload: Partial<AuthRes> = {
      userType: 'Location',
      locationId: location_id,
      companyId: company_id,
    };
    return tokenService.getGHLToken('', '', locationTokenPayload, tokenData.access_token);
  },

  async createLocation(locationId: string, locationData: {
    companyId: string;
    name: string;
    email: string;
    stripeProductId: string;
    appId: string;
  }): Promise<void> {
    const db = admin.firestore();
    await db.collection('locations').doc(locationId).set({
      locationId,
      ...locationData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`Location created: ${locationId}`);
  },




  /**
  * 
  * @param locationId - The ID of the location to install
  * @param installData - Basic installation data
  */
 async installLocation(locationId: string, installData: {
   companyId: string;
   appId: string;
 }): Promise<void> {
   const db = admin.firestore();
   const locationRef = db.collection('locations').doc(locationId);
   const locationDoc = await locationRef.get();
   
   if (locationDoc.exists) {
     await locationRef.update({
       ...installData,
       isInstalled: true,
       installedAt: admin.firestore.FieldValue.serverTimestamp(),
       updatedAt: admin.firestore.FieldValue.serverTimestamp()
     });
   } else {
     await locationRef.set({
       locationId,
       ...installData,
       isInstalled: true,
       installedAt: admin.firestore.FieldValue.serverTimestamp(),
       createdAt: admin.firestore.FieldValue.serverTimestamp(),
       updatedAt: admin.firestore.FieldValue.serverTimestamp()
     });
   }
   console.log(`Location installed: ${locationId}`);
 },


     /**
     * Uninstalls a location by marking it as uninstalled or deleting it if it exists.
     * 
     * @param locationId - The ID of the location to uninstall
     */
     async uninstallLocation(locationId: string): Promise<void> {
      const db = admin.firestore();
      const locationRef = db.collection('locations').doc(locationId);
      const locationDoc = await locationRef.get();
      
      if (locationDoc.exists) {
        await locationRef.delete();
        console.log(`Location ${locationId} successfully uninstalled and deleted`);
      } else {
        console.log(`Location ${locationId} not found for uninstall`);
      }
    },

    /**
     * Compares locations from GHL with locations in the database
     * Returns locations that exist in GHL but not in the database
     * 
     * @param locationsInGHL - Locations data from GHL API
     * @param locationsInDB - Locations data from database
     * @returns Array of locations that exist in GHL but not in the database
     * 
     */
    async compareLocations(locationsInGHL: GHLLocation[]): Promise<GHLLocation[]> {
      const db = admin.firestore();
      const locationsRef = db.collection('locations');
      const locationsInDB = await locationsRef.get();
      return locationsInGHL.filter(location => !locationsInDB.docs.some(dbLocation => dbLocation.id === location._id));
    }
}

