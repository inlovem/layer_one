export type User = {
  id: string;
  ghlUserId?: string | null;
  ghlLocationId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  extension?: string;
  type?: string;
  role?: string;
  isEjectedUser?: boolean;
  ghlLocationIds?: string[];
  ghlLocations?: Location[];
  locale?: string;
  permissions?: {
    adwordsReportingEnabled?: boolean;
    affiliateManagerEnabled?: boolean;
    agentReportingEnabled?: boolean;
    appointmentsEnabled?: boolean;
    assignedDataOnly?: boolean;
    attributionsReportingEnabled?: boolean;
    bloggingEnabled?: boolean;
    botService?: boolean;
    bulkRequestsEnabled?: boolean;
    campaignsEnabled?: boolean;
    campaignsReadOnly?: boolean;
    cancelSubscriptionEnabled?: boolean;
    communitiesEnabled?: boolean;
    contactsEnabled?: boolean;
    contentAiEnabled?: boolean;
    conversationsEnabled?: boolean;
    dashboardStatsEnabled?: boolean;
    facebookAdsReportingEnabled?: boolean;
    funnelsEnabled?: boolean;
    invoiceEnabled?: boolean;
    leadValueEnabled?: boolean;
    marketingEnabled?: boolean;
    membershipEnabled?: boolean;
    onlineListingsEnabled?: boolean;
    opportunitiesEnabled?: boolean;
    paymentsEnabled?: boolean;
    phoneCallEnabled?: boolean;
    recordPaymentEnabled?: boolean;
    refundsEnabled?: boolean;
    reviewsEnabled?: boolean;
    settingsEnabled?: boolean;
    socialPlanner?: boolean;
    tagsEnabled?: boolean;
    triggersEnabled?: boolean;
    websitesEnabled?: boolean;
    workflowsEnabled?: boolean;
    workflowsReadOnly?: boolean;
  };
 };


 export type UserBaseInput = {
  id?: string;
  userId?: string;
  locationId?: string;
  companyId?: string;
  userName?: string; // GHL username
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  extension?: string;
  type?: string;
  role?: string;
  locationIds?: string[];
  permissions?: any;
  activeLocation?: string;
};

// For webhook/API inputs
export type WebhookUserInput = UserBaseInput & {
  type: 'UserCreate' | 'UserUpdate';
  userName?: string;
  activeLocation?: string;
  userId?: string;
};

// For SSO inputs
export type SSOUserInput = UserBaseInput & {
  sub?: string; // SSO identifier
  name?: string; // Full name from SSO
  userId?: string; // GHL user ID
  companyId?: string; // GHL company ID
};

// For direct admin inputs
export type AdminUserInput = UserBaseInput & {
  password?: string;
  isEjectedUser?: boolean;
};

// Union type for all user inputs
export type UserInput = WebhookUserInput | SSOUserInput | AdminUserInput;
