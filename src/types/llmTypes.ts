import { LcPhone, UserPermissions, UserRoles } from "./userTypes.js";

export interface UserIdWithWorkspace {
    userId: string; // is mapped from locationId in GHL
    id: string[]// is mapped from userId in GHL
  }
  
