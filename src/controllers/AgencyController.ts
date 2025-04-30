// src/controllers/AgencyController.ts
import { agencyOrchestrator } from "../services/orchestrators/AgencyOrchestrator";
import { AgencyInput } from "../types/agencyTypes";
import { FastifyError } from "fastify";


/**
 * Handles agency installation and uninstallation events.
 * 
 * @param variables - The agency input data from the webhook or token exchange.
 * @returns A promise that resolves when the operation is complete.
 * @throws An error if the operation fails.
 */
export async function agencyInstallController(variables: AgencyInput) {
  try {
    if (variables.type === 'INSTALL') {
      await agencyOrchestrator.install(variables);
    } else {
      await agencyOrchestrator.uninstall(variables.companyId);
    }
  } catch (error: any) {
    console.error("Agency orchestrator error:", error);
    const msg = `Failed to ${variables.type.toLowerCase()} agency: ${error.message}`;
    const err = new Error(msg);
    (err as FastifyError).statusCode = error.statusCode || 500;
    throw err;
  }
}


