import { locationService } from "../LocationService";
import { FastifyError } from "fastify";

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
      return await locationService.installLocation(id, params);
    },
  
    async uninstall(id: string) {
      if (!id) {
        const err = new Error("Location ID is required");
        (err as FastifyError).statusCode = 400;
        throw err;
      }
      await locationService.uninstallLocation(id);
    }
  };