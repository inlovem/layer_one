
interface WhitelabelDetails {
    domain?: string;
    logoUrl?: string;
    companyName?: string;
  }
  
  interface Trial {
    onTrial: boolean;
    trialDuration: number;
    trialStartDate: Date;
  }
  
interface AgencyInput {
    type: string;
    appId: string;
    companyId: string;
    locationId?: string;
    userId?: string;
    planId?: string;
    trial?: Trial;
    isWhitelabelCompany?: boolean;
    whitelabelDetails?: WhitelabelDetails;
    companyName?: string;
    installType?: string;
    access_token?: string;
    token_type?: string;
    expires_in?: number;
    refresh_token?: string;
    scope?: string;
    userType?: string;
    approvedLocations?: string[];
  }


export { AgencyInput };