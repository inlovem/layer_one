import { JWT } from "@fastify/jwt";

export type DeepPartial<T> = Partial<{ [P in keyof T]: DeepPartial<T[P]> }>;

export type LocationMember = {
  id: string;
  roles: Array<string>;
};


export type Token = {
    id?: string 
    access_token?: string; 
    expires_in?: number;
    refresh_token?:  string;
    userId?: string;
    approvedLocations: string[]
    scope?: string;
    userType?: string;
    locationId?: string;
    companyId?: string;
    token_type?: string;
    planId?: string;
    traceId?: string;
}

export type Location = {
  id: string;
  name: string | null;
  locationId?: string | null;
  phone?: string | null | null;
  companyId: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  email?: string | null;
  members: Array<LocationMember>;
  plan?: string | null;
};


export type GetContactsParams = {
  type?: string;
  userId: string;
  refresh?: boolean;
};

export type GetContactParams = {
  id: string;
  userId: string;
  refresh?: boolean;
};


export type PartialSearch = {
  id: string;
  query: string;
  response: string;
  createdAt: string;
  updatedAt?: string;
};


// Input type for the controller
export interface CarrierContactInput {
  type: 'ContactCreate' | 'ContactUpdate';
  locationId: string;
  appId?: string;
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dnd?: boolean;
  tags?: string[];
  country?: string;
  dateAdded?: string;
  customFields?: any[];
  // Frontend specific fields
  title?: string;
  linkedInUrl?: string;
  private?: boolean;
}




declare module "fastify" {
  interface FastifyRequest {
    jwt: JWT;
  }
}

export type MetaData = Record<string, string | string[] | number | number[]>;
