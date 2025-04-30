// src/services/AgencyOrchestrator.ts
import { agencyService } from "../AgencyService";
import { FastifyError } from "fastify";
import { AgencyInput } from "../../types/agencyTypes";
/**
 * Orchestrator for agency operations; validates input
 * and delegates to agencyService for persistence.
 */
export const agencyOrchestrator = {
  async install(input: AgencyInput) {
    const { companyId, appId } = input;
    if (!companyId || !appId) {
      const err = new Error("companyId and appId are required");
      (err as FastifyError).statusCode = 400;
      throw err;
    }
    return agencyService.installOrUpdateAgency(input);
  },

  async uninstall(companyId: string) {
    if (!companyId) {
      const err = new Error("companyId is required");
      (err as FastifyError).statusCode = 400;
      throw err;
    }
    return agencyService.uninstallAgency(companyId);
  }
};