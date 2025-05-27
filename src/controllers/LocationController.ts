// src/controllers/LocationController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { locationOrchestrator } from "../services/orchestrators/LocationOrchestrator";
import { CreateLocationDTO, UpdateLocationDTO, InstallParams } from "../types/locationTypes";
import { installationOrchestrator } from "../services/orchestrators/InstallationOrchestrator";

// Handler: POST /locations
export async function createLocationHandler(
  request: FastifyRequest<{ Body: CreateLocationDTO }>,
  reply: FastifyReply
) {
  try {
    const location = await locationOrchestrator.create(request.body);
    return reply.status(201).send({ success: true, location });
  } catch (err: any) {
    request.log.error(err);
    const status = (err.statusCode as number) || 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

// Handler: PATCH /locations/:id
export async function updateLocationHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateLocationDTO }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const updated = await locationOrchestrator.update(id, request.body);
    return reply.send({ success: true, updated });
  } catch (err: any) {
    request.log.error(err);
    const status = (err.statusCode as number) || 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

// Handler: POST /locations/:id/install
export async function installLocationHandler(
  request: FastifyRequest<{ Params: { id: string }; Body: InstallParams }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    const params = request.body;
    const result = await installationOrchestrator.processInstallation('', { locationId: id, companyId: params.companyId, appId: params.appId });

    return reply.send({ success: true, result });
  } catch (err: any) {
    request.log.error(err);
    const status = (err.statusCode as number) || 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}

// Handler: DELETE /locations/:id
export async function uninstallLocationHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = request.params;
    await locationOrchestrator.uninstall(id);
    return reply.send({ success: true });
  } catch (err: any) {
    request.log.error(err);
    const status = (err.statusCode as number) || 500;
    return reply.status(status).send({ success: false, error: err.message });
  }
}
