

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
  type: 'UserCreate';
  userName?: string;
  activeLocation?: string;
  userId?: string;
  updatedAt?: Date;
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




export interface UserPermissions {
  campaignsEnabled: boolean;
  campaignsReadOnly: boolean;
  contactsEnabled: boolean;
  workflowsEnabled: boolean;
  workflowsReadOnly: boolean;
  triggersEnabled: boolean;
  funnelsEnabled: boolean;
  websitesEnabled: boolean;
  opportunitiesEnabled: boolean;
  dashboardStatsEnabled: boolean;
  bulkRequestsEnabled: boolean;
  appointmentsEnabled: boolean;
  reviewsEnabled: boolean;
  onlineListingsEnabled: boolean;
  phoneCallEnabled: boolean;
  conversationsEnabled: boolean;
  assignedDataOnly: boolean;
  adwordsReportingEnabled: boolean;
  membershipEnabled: boolean;
  facebookAdsReportingEnabled: boolean;
  attributionsReportingEnabled: boolean;
  settingsEnabled: boolean;
  tagsEnabled: boolean;
  leadValueEnabled: boolean;
  marketingEnabled: boolean;
  agentReportingEnabled: boolean;
  botService: boolean;
  socialPlanner: boolean;
  bloggingEnabled: boolean;
  invoiceEnabled: boolean;
  affiliateManagerEnabled: boolean;
  contentAiEnabled: boolean;
  refundsEnabled: boolean;
  recordPaymentEnabled: boolean;
  cancelSubscriptionEnabled: boolean;
  paymentsEnabled: boolean;
  communitiesEnabled: boolean;
  exportPaymentsEnabled: boolean;
}

export interface UserRoles {
  type: string;
  role: string;
  locationIds: string[];
  restrictSubAccount: string;
}

export interface LcPhone {
  locationId: string;
}

export interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  extension: string;
  permissions: UserPermissions;
  scopes: string;
  roles: UserRoles;
  deleted: boolean;
  lcPhone: LcPhone;
}

export interface UsersResponse {
  users: User[];
}


// Union type for all user inputs
export type UserInput = WebhookUserInput | SSOUserInput | AdminUserInput;
