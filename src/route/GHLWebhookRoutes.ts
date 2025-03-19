// src/routes/GHLWebhookRoutes.ts

import {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
  FastifyPluginAsync,
} from "fastify";
import * as Controller from "../controllers/index";
import { Contact, Note } from "src/types/contactTypes";
import { CallMessage, EmailMessage, SMSMessage } from "src/types/messageTypes";

export const GHLWebhookRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance
) => {
  fastify.route({
    method: "POST",
    url: "/gohighlevel-webhooks",
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const payload = request.body as any;
        const eventType = payload.type;
        console.log(`Received GHL webhook event: ${eventType}`, payload);

        switch (eventType) {
          case "INSTALL":
            try {
              await Controller.locationController({
                type: "INSTALL",
                id: payload.appId,
                appId: payload.appId,
                installType: payload.installType,
                locationId: payload.locationId,
                companyId: payload.companyId,
                userId: payload.userId,
                planId: payload.planId,
                trial: payload.trial,
              });
              console.log(`Location installed: ${payload.locationId}`);
            } catch (err) {
              console.error("Error installing location:", err);
              throw err;
            }
            break;

          case "UserCreate":
          case "UserUpdate":
            try {
              await Controller.userController({
                type: eventType,
                id: payload.id,
                locationId: payload.locationId,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                phone: payload.phone,
                extension: payload.extension,
                role: payload.role,
                permissions: payload.permissions,
              });
              console.log(
                `User ${eventType === "UserCreate" ? "created" : "updated"}: ${payload.email} (${payload.id})`
              );
            } catch (err) {
              console.error(
                `Error ${eventType === "UserCreate" ? "creating" : "updating"} user:`,
                err
              );
              throw err;
            }
            break;

          case "LocationCreate":
          case "LocationUpdate":
            try {
              await Controller.locationController({
                type: eventType,
                id: payload.id,
                companyId: payload.companyId,
                name: payload.name,
                email: payload.email,
                stripeProductId: payload.stripeProductId,
                appId: payload.appId,
              });
              if (eventType === "LocationCreate") {
                // Create location tokens if the event is a creation.
                await Controller.createLocationTokens(payload.companyId, payload.locationId);
              }
              console.log(
                `Location ${eventType === "LocationCreate" ? "created" : "updated"}: ${payload.id}`
              );
            } catch (err) {
              console.error(
                `Error ${eventType === "LocationCreate" ? "creating" : "updating"} location:`,
                err
              );
              throw err;
            }
            break;

          case "ContactCreate":
          case "ContactUpdate":
            try {
              const contact : Contact = {
                type: eventType as "ContactCreate" | "ContactUpdate",
                ...payload
              } 
              await Controller.upsertContact(contact);
              console.log(
                `Contact ${eventType === "ContactCreate" ? "created" : "updated"}: ${payload.id}`
              );
            } catch (err) {
              console.error(
                `Error ${eventType === "ContactCreate" ? "creating" : "updating"} contact:`,
                err
              );
              throw err;
            }
            break;

          case "ContactDelete":
            try {
              await Controller.deleteContact(payload.id);
              console.log(`Contact deleted: ${payload.ed}`);
            } catch (err) {
              console.error("Error deleting contact:", err);
              throw err;
            }
            break;

          case "NoteCreate":
            try {
              const note: Note = {
                type: "NoteCreate",
                ...payload
              }
              await Controller.addNote(note);
              console.log(`Note created: ${payload.id}`);
            } catch (err) {
              console.error("Error creating note:", err);
              throw err;
            }
            break;

            case "InboundMessage":
              try {
                switch (payload.messageType) {
                  case "SMS": {
                    const smsMessage: SMSMessage = {
                      type: "InboundMessage",
                      ...payload,
                      // Optionally enforce literal values if needed:
                      messageType: "SMS",
                    };
                    await Controller.handleInboundSMS(smsMessage);
                    console.log(`Inbound SMS processed: ${payload.contactId}`);
                    break;
                  }
                  case "CALL": {
                    const callMessage: CallMessage = {
                      type: "InboundMessage",
                      ...payload,
                      messageType: "CALL",
                    };
                    await Controller.handleInboundCall(callMessage);
                    console.log(`Inbound Call processed: ${payload.contactId}`);
                    break;
                  }
                  case "Email": {
                    const emailMessage: EmailMessage = {
                      type: "InboundMessage",
                      ...payload,
                      messageType: "Email",
                    };
                    await Controller.handleInboundEmail(emailMessage);
                    console.log(`Inbound Email processed: ${payload.contactId}`);
                    break;
                  }
                  default:
                    console.error("Unsupported inbound message type:", payload.messageType);
                }
              } catch (err) {
                console.error("Error processing inbound message:", err);
                throw err;
              }
              break;



          default:
            console.log(`Unhandled GHL event type: ${eventType}`);
            break;
        }

        reply.code(200).send({ success: true });
      } catch (error) {
        console.error("Error handling GHL webhook:", error);
        reply.code(500).send({
          error: "Error handling webhook",
          details: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  });
};
