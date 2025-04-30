import admin from "../utils/firebase";
import { AgencyInput } from "../types/agencyTypes";



// Create the Agency Repository
export const agencyRepos = {
    /**
     * Checks if a company exists in the database.
     * 
     * @param companyId - The ID of the company to check
     * @returns A promise that resolves to true if the company exists, false otherwise
     */
    async checkCompanyExists(companyId: string): Promise<boolean> {
      const db = admin.firestore();
      const companyRef = db.collection('companies').doc(companyId);
      const companySnapshot = await companyRef.get();
      return companySnapshot.exists;
    },
    
    /**
     * Deletes a company from the database.
     * 
     * @param companyId - The ID of the company to delete
     */
    async deleteCompany(companyId: string): Promise<void> {
      const db = admin.firestore();
      await db.recursiveDelete(db.collection('companies').doc(companyId));
      await db.collection('companies').doc(companyId).delete();
    },
    
    /**
     * Creates a new company in the database.
     * 
     * @param agencyData - The agency data to create
     */
    async createCompany(agencyData: AgencyInput): Promise<void> {
      const db = admin.firestore();
      const companyRef = db.collection('companies').doc(agencyData.companyId);
      
      const companyData = {
        companyId: agencyData.companyId,
        appId: agencyData.appId,
        userId: agencyData.userId,
        planId: agencyData.planId || null,
        companyName: agencyData.companyName || 'Unknown Company',
        installType: agencyData.installType,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        isWhitelabelCompany: agencyData.isWhitelabelCompany || false,
        whitelabelDetails: agencyData.whitelabelDetails || null,
        trial: agencyData.trial || null,
        // Token related fields
        company_token_id: agencyData.companyId,
        token_type: agencyData.token_type,
        expires_in: agencyData.expires_in,
        scope: agencyData.scope,
        userType: agencyData.userType,
        approvedLocations: agencyData.approvedLocations || []
      };
      
      await companyRef.set(companyData);
    },
    
    /**
     * Updates an existing company in the database.
     * 
     * @param agencyData - The agency data to update
     */
    async updateCompany(agencyData: AgencyInput): Promise<void> {
      const db = admin.firestore();
      const companyRef = db.collection('companies').doc(agencyData.companyId);
      
      const updateData = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        token_type: agencyData.token_type,
        expires_in: agencyData.expires_in,
        scope: agencyData.scope,
        userType: agencyData.userType,
        approvedLocations: agencyData.approvedLocations || []
      };
      
      await companyRef.update(updateData);
    }
  };