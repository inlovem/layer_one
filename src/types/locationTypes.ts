export interface Location {
    _id: string;        // Location ID (e.g., "0IHuJvc2ofPAAA8GzTRi")
    name: string;       // Name of the location (e.g., "John Deo")
    address: string;    // Address linked to location (e.g., "47 W 13th St, New York, NY 10011, USA")
    isInstalled: boolean; // Check if the requested app is installed for this location
    trial?: boolean;
  }
  
  export interface LocationsResponse {
    locations: Location[];
    count: number;      // Total location count under the company
    installToFutureLocations: boolean | null; // Controls if app is automatically installed to future locations
  }
  
  export let allLocations: LocationsResponse = { 
    locations: [], 
    count: 0, 
    installToFutureLocations: null, 
  };

export interface LocationToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    userType: string;
    companyId: string;
    locationId: string;
    userId: string;
    traceId: string;
  }
  
  
  export interface CreateLocationDTO {
    companyId: string;
    name: string;
    email: string;
    stripeProductId: string;
    appId: string;
  }
export interface UpdateLocationDTO {
    companyId: string;
    name: string;
    email: string;
    stripeProductId: string;
    appId: string;
  }

export interface InstallParams {
    companyId: string;
    appId: string;
  }

export interface LocationWithToken {
    locationId: string;
    access_token: string;
}

