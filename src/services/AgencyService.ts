import { agencyRepos } from "../repositories/AgencyRepos";
import { AgencyInput } from "../types/agencyTypes";
import { tokenRepos } from "../repositories/TokenRepos";
import { agencyOrchestrator } from "./orchestrators/AgencyOrchestrator";

// Create the Agency Service
export const agencyService = {
    /**
     * Uninstalls an agency by removing it from the database.
     * 
     * @param companyId - The ID of the company to uninstall
     */
    async uninstallAgency(companyId: string): Promise<void> {
      if (!companyId) {
        throw new Error('Company ID is required for uninstallation');
      }
      
      const exists = await agencyRepos.checkCompanyExists(companyId);
      
      if (exists) {
        await agencyRepos.deleteCompany(companyId);
        await tokenRepos.removeToken(companyId, 'Company');
        console.log(`Company ${companyId} successfully uninstalled`);
      } else {
        console.log(`Company ${companyId} not found for uninstall`);
      }
    },
    
    /**
     * Installs or updates an agency in the database.
     * 
     * @param agencyData - The agency data to install or update
     */
    async installOrUpdateAgency(agencyData: AgencyInput): Promise<void> {
      if (!agencyData.companyId) {
        throw new Error('Company ID is required for installation');
      }
      
      const exists = await agencyRepos.checkCompanyExists(agencyData.companyId);
      
      if (!exists) {
        await agencyRepos.createCompany(agencyData);
        console.log(`Company ${agencyData.companyId} successfully installed`);
      } else {
        await agencyRepos.updateCompany(agencyData);
        console.log(`Company ${agencyData.companyId} successfully updated`);
      }
    },
    /**
     * Handles the company installation process.
     * 
     * @param companyToken - The token data for the company.
     */
    async handleCompanyInstallation(companyToken: any) {
        const companyData = {
            ...companyToken,
            type: 'INSTALL',
            appId: process.env.GOHL_APP_ID!,
            companyName: process.env.GOHL_COMPANY_NAME || 'Default Company',
            installType: 'OAuth',
        }
        await agencyOrchestrator.install(companyData)
    },
    
  };
  