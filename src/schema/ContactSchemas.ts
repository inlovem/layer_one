// src/schemas/ContactSchemas.ts

import { Type } from "@fastify/type-provider-typebox";
import { FastifySchema } from "fastify";
import {
  ERROR400,
  ERROR401,
  ERROR404,
  ERROR409,
  ERROR500,
  responseProperty,
} from "../constants/constants";

export const GetContactsSchema: FastifySchema = {
  params: Type.Object({
    type: Type.String(),
  }),
  querystring: Type.Object({
    refresh: Type.Optional(Type.String()),
  }),
  response: {
    200: Type.Object({
      contacts: Type.Array(
        Type.Object({
          id: Type.String(),
          docketNumber: Type.Optional(Type.String()),
          dotNumber: Type.Optional(Type.String()),
          legalName: Type.Optional(Type.String()),
          dbaName: Type.Optional(Type.String()),
          busnAddress: Type.Optional(Type.String()),
          busnCity: Type.Optional(Type.String()),
          busnState: Type.Optional(Type.String()),
          busnZip: Type.Optional(Type.String()),
          busnColonia: Type.Optional(Type.String()),
          busnCountry: Type.Optional(Type.String()),
          busnPhone: Type.Optional(Type.String()),
          busnFax: Type.Optional(Type.String()),
          mailAddress: Type.Optional(Type.String()),
          mailCity: Type.Optional(Type.String()),
          mailState: Type.Optional(Type.String()),
          mailZip: Type.Optional(Type.String()),
          mailColonia: Type.Optional(Type.String()),
          mailCountry: Type.Optional(Type.String()),
          mailPhone: Type.Optional(Type.String()),
          mailFax: Type.Optional(Type.String()),
          undelivMail: Type.Optional(Type.String()),
          email: Type.String(),
          companyRep1: Type.Optional(Type.String()),
          fleetSize: Type.Optional(Type.String()),
          authority: Type.Optional(Type.String()),
          authorityMaintainedDate: Type.Optional(
            Type.String({ format: "date-time" })
          ),
          truckTypes: Type.Optional(Type.String()),
          freightTypes: Type.Optional(Type.String()),
          shipmentTypes: Type.Optional(Type.String()),
          insuranceAmount: Type.Optional(Type.Number()),
          safetyRating: Type.Optional(Type.String()),
          electronicTracking: Type.Optional(Type.Boolean()),
          type: Type.Optional(Type.String()),
          tags: Type.Optional(Type.Array(Type.String())),
          avatar: Type.Optional(Type.String()),
          createdAt: Type.String({ format: "date-time" }),
          updatedAt: Type.Optional(Type.String({ format: "date-time" })),
          sortOrder: Type.Optional(Type.Number()),
        })
      ),
    }),
    400: ERROR400,
    500: ERROR500,
  },
};

const GetContactQuerySchema = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  refresh: Type.Optional(Type.Boolean()),
});

export const GetContactSchema: FastifySchema = {
  params: Type.Object({
    id: Type.String(),
  }),
  response: {
    200: Type.Object({
      contact: Type.Object({
        id: Type.String(),
        docketNumber: Type.Optional(Type.String()),
        dotNumber: Type.Optional(Type.String()),
        legalName: Type.Optional(Type.String()),
        dbaName: Type.Optional(Type.String()),
        busnAddress: Type.Optional(Type.String()),
        busnCity: Type.Optional(Type.String()),
        busnState: Type.Optional(Type.String()),
        busnZip: Type.Optional(Type.String()),
        busnColonia: Type.Optional(Type.String()),
        busnCountry: Type.Optional(Type.String()),
        busnPhone: Type.Optional(Type.String()),
        busnFax: Type.Optional(Type.String()),
        mailAddress: Type.Optional(Type.String()),
        mailCity: Type.Optional(Type.String()),
        mailState: Type.Optional(Type.String()),
        mailZip: Type.Optional(Type.String()),
        mailColonia: Type.Optional(Type.String()),
        mailCountry: Type.Optional(Type.String()),
        mailPhone: Type.Optional(Type.String()),
        mailFax: Type.Optional(Type.String()),
        undelivMail: Type.Optional(Type.String()),
        email: Type.String(),
        companyRep1: Type.Optional(Type.String()),
        fleetSize: Type.Optional(Type.String()),
        authority: Type.Optional(Type.String()),
        authorityMaintainedDate: Type.Optional(
          Type.String({ format: "date-time" })
        ),
        truckTypes: Type.Optional(Type.String()),
        freightTypes: Type.Optional(Type.String()),
        shipmentTypes: Type.Optional(Type.String()),
        insuranceAmount: Type.Optional(Type.Number()),
        safetyRating: Type.Optional(Type.String()),
        electronicTracking: Type.Optional(Type.Boolean()),
        type: Type.Optional(Type.String()),
        tags: Type.Optional(Type.Array(Type.String())),
        avatar: Type.Optional(Type.String()),
        createdAt: Type.String({ format: "date-time" }),
        updatedAt: Type.Optional(Type.String({ format: "date-time" })),
        sortOrder: Type.Optional(Type.Number()),
      }),
    }),
    404: ERROR404,
    500: ERROR500,
  },
};

export const GetContactActivitiesSchema: FastifySchema = {
  querystring: GetContactQuerySchema,
  response: {
    200: Type.Object({
      activities: Type.Array(
        Type.Object({
          id: Type.String(),
          userId: Type.Optional(Type.String()),
          type: Type.String(),
          data: Type.Optional(Type.Object({})),
          date: Type.String(),
          createdAt: Type.String(),
          updatedAt: Type.Optional(Type.String()),
          readAt: Type.Optional(Type.String()),
          user: Type.Optional(
            Type.Object({ id: Type.String(), name: Type.String() })
          ),
        })
      ),
    }),
    404: ERROR404,
    500: ERROR500,
  },
};

/**
 * Schema for creating a contact body.
 */
const CreateContactBodySchema = Type.Object({
  userId: Type.String(),
  docketNumber: Type.Optional(Type.String()),
  legalName: Type.Optional(Type.String()),
  dbaName: Type.Optional(Type.String()),
  busnAddress: Type.Optional(Type.String()),
  busnCity: Type.Optional(Type.String()),
  busnState: Type.Optional(Type.String()),
  busnZip: Type.Optional(Type.String()),
  busnColonia: Type.Optional(Type.String()),
  busnCountry: Type.Optional(Type.String()),
  busnPhone: Type.Optional(Type.String()),
  busnFax: Type.Optional(Type.String()),
  mailAddress: Type.Optional(Type.String()),
  mailCity: Type.Optional(Type.String()),
  mailState: Type.Optional(Type.String()),
  mailZip: Type.Optional(Type.String()),
  mailColonia: Type.Optional(Type.String()),
  mailCountry: Type.Optional(Type.String()),
  mailPhone: Type.Optional(Type.String()),
  mailFax: Type.Optional(Type.String()),
  undelivMail: Type.Optional(Type.String()),
  authCommon: Type.Optional(Type.String()),
  authCommonPending: Type.Optional(Type.String()),
  authCommonRevocation: Type.Optional(Type.String()),
  authContract: Type.Optional(Type.String()),
  authContractPending: Type.Optional(Type.String()),
  authContractRevocation: Type.Optional(Type.String()),
  authBroker: Type.Optional(Type.String()),
  authBrokerPending: Type.Optional(Type.String()),
  authBrokerRevocation: Type.Optional(Type.String()),
  authTypeFreight: Type.Optional(Type.String()),
  authTypePassenger: Type.Optional(Type.String()),
  authTypeHousehold: Type.Optional(Type.String()),
  authTypePrivate: Type.Optional(Type.String()),
  authTypeEnterprise: Type.Optional(Type.String()),
  mxType: Type.Optional(Type.String()),
  rfcNumber: Type.Optional(Type.String()),
  oaMCPropertyCommon: Type.Optional(Type.String()),
  oaCommon: Type.Optional(Type.String()),
  oaMCPropertyContract: Type.Optional(Type.String()),
  oaContract: Type.Optional(Type.String()),
  oaMCHouseholdCommon: Type.Optional(Type.String()),
  oaMCHouseholdContract: Type.Optional(Type.String()),
  oaBrokerProperty: Type.Optional(Type.String()),
  oaBrokerHousehold: Type.Optional(Type.String()),
  oaBroker: Type.Optional(Type.String()),
  oaFFProperty: Type.Optional(Type.String()),
  oaFFHousehold: Type.Optional(Type.String()),
  oaMCPassengerCommon: Type.Optional(Type.String()),
  oaMCPassengerContract: Type.Optional(Type.String()),
  oaMCPassengerRegRoute: Type.Optional(Type.String()),
  oaForHireExemptProperty: Type.Optional(Type.String()),
  oaForHireHousehold: Type.Optional(Type.String()),
  oaForeHireProperty: Type.Optional(Type.String()),
  oaEnterprise: Type.Optional(Type.String()),
  oaEnterpriseHousehold: Type.Optional(Type.String()),
  oaPrivateCarrier: Type.Optional(Type.String()),
  oaTemporary: Type.Optional(Type.String()),
  oaEmergencyTemp: Type.Optional(Type.String()),
  bipdRequired: Type.Optional(Type.String()),
  bipdOnFile: Type.Optional(Type.String()),
  cargoRequired: Type.Optional(Type.String()),
  cargoOnFile: Type.Optional(Type.String()),
  bondRequired: Type.Optional(Type.String()),
  bondOnFile: Type.Optional(Type.String()),
  bocCompanyName: Type.Optional(Type.String()),
  email: Type.Optional(Type.String()),
  companyRep1: Type.Optional(Type.String()),
  fleetSize: Type.Optional(Type.String()),
  authority: Type.Optional(Type.String()),
  authorityMaintainedDate: Type.Optional(Type.String()),
  truckTypes: Type.Optional(Type.String()),
  freightTypes: Type.Optional(Type.String()),
  shipmentTypes: Type.Optional(Type.String()),
  insuranceAmount: Type.Optional(Type.String()),
  safetyRating: Type.Optional(Type.String()),
  electronicTracking: Type.Optional(Type.String()),
  type: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(Type.String())),
  avatar: Type.Optional(Type.String()),
});

export const CreateContactSchema: FastifySchema = {
  body: CreateContactBodySchema,
  response: {
    200: Type.Object({
      createContact: Type.Object({
        id: Type.String(),
        docketNumber: Type.Optional(Type.String()),
        dotNumber: Type.Optional(Type.String()),
        legalName: Type.Optional(Type.String()),
        dbaName: Type.Optional(Type.String()),
        busnAddress: Type.Optional(Type.String()),
        busnCity: Type.Optional(Type.String()),
        busnState: Type.Optional(Type.String()),
        busnZip: Type.Optional(Type.String()),
        busnColonia: Type.Optional(Type.String()),
        busnCountry: Type.Optional(Type.String()),
        busnPhone: Type.Optional(Type.String()),
        busnFax: Type.Optional(Type.String()),
        mailAddress: Type.Optional(Type.String()),
        mailCity: Type.Optional(Type.String()),
        mailState: Type.Optional(Type.String()),
        mailZip: Type.Optional(Type.String()),
        mailColonia: Type.Optional(Type.String()),
        mailCountry: Type.Optional(Type.String()),
        mailPhone: Type.Optional(Type.String()),
        mailFax: Type.Optional(Type.String()),
        undelivMail: Type.Optional(Type.String()),
        email: Type.Optional(Type.String()),
        companyRep1: Type.Optional(Type.String()),
        fleetSize: Type.Optional(Type.String()),
        authority: Type.Optional(Type.String()),
        authorityMaintainedDate: Type.Optional(Type.String()),
        truckTypes: Type.Optional(Type.String()),
        freightTypes: Type.Optional(Type.String()),
        shipmentTypes: Type.Optional(Type.String()),
        insuranceAmount: Type.Optional(Type.Number()),
        safetyRating: Type.Optional(Type.String()),
        electronicTracking: Type.Optional(Type.Boolean()),
        type: Type.Optional(Type.String()),
        tags: Type.Optional(Type.Array(Type.String())),
        avatar: Type.Optional(Type.String()),
        createdAt: Type.String({ format: "date-time" }),
        updatedAt: Type.Optional(Type.String({ format: "date-time" })),
        sortOrder: Type.Optional(Type.Number()),
      }),
    }),
    400: ERROR400,
    500: ERROR500,
  },
};

const UpdateContactBodySchema = Type.Object({
  userId: Type.String(),
  id: Type.String(),
  firstName: Type.Optional(Type.String()),
  lastName: Type.Optional(Type.String()),
  email: Type.String({ format: "email" }),
  phone: Type.Optional(Type.String()),
  type: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()),
  tags: Type.Optional(Type.Array(Type.String())),
  avatar: Type.Optional(Type.String()),
  sortOrder: Type.Optional(Type.Number()),
});

export const UpdateContactSchema: FastifySchema = {
  body: UpdateContactBodySchema,
  response: {
    200: Type.Object({
      updateContact: Type.Object({
        id: Type.String(),
        firstName: Type.Optional(Type.String()),
        lastName: Type.Optional(Type.String()),
        name: Type.Optional(Type.String()),
        email: Type.String(),
        avatar: Type.Optional(Type.String()),
        status: Type.Optional(Type.String()),
        type: Type.Optional(Type.String()),
        phone: Type.Optional(Type.String()),
        tags: Type.Optional(Type.Array(Type.String())),
        sortOrder: Type.Optional(Type.Number()),
        createdAt: Type.String({ format: "date-time" }),
        updatedAt: Type.Optional(Type.String({ format: "date-time" })),
        // User: Type.Optional(Type.Array(Type.Object({}))), // Detailed user schema could be placed here
        // Organization: Type.Optional(Type.Array(Type.Object({}))), // Detailed organization schema could be placed here
      }),
    }),
    400: ERROR400,
    404: ERROR404,
    500: ERROR500,
  },
};

export const DeleteContactSchema: FastifySchema = {
  querystring: GetContactQuerySchema,
  response: {
    200: Type.Object({
      deleteContact: Type.Object({
        id: Type.String(),
        firstName: Type.Optional(Type.String()),
        lastName: Type.Optional(Type.String()),
        name: Type.Optional(Type.String()),
        email: Type.String(),
        avatar: Type.Optional(Type.String()),
        status: Type.Optional(Type.String()),
        type: Type.Optional(Type.String()),
        phone: Type.Optional(Type.String()),
        tags: Type.Optional(Type.Array(Type.String())),
        sortOrder: Type.Optional(Type.Number()),
        createdAt: Type.String({ format: "date-time" }),
        updatedAt: Type.Optional(Type.String({ format: "date-time" })),
        // User: Type.Optional(Type.Array(Type.Object({}))), // Detailed user schema could be placed here
        // Organization: Type.Optional(Type.Array(Type.Object({}))), // Detailed organization schema could be placed here
      }),
    }),
    400: ERROR400,
    404: ERROR404,
    500: ERROR500,
  },
};

export const CreateCommentSchema: FastifySchema = {
  body: Type.Object({
    userId: Type.String(),
    contactId: Type.String(),
    text: Type.String(),
  }),
  response: {
    200: Type.Object({
      createComment: Type.Object({
        id: Type.String(),
        userId: Type.String(),
        contactId: Type.String(),
        text: Type.String(),
        createdAt: Type.String({ format: "date-time" }),
        updatedAt: Type.Optional(Type.String({ format: "date-time" })),
        user: Type.Object({ id: Type.String(), name: Type.String() }),
      }),
    }),
    400: ERROR400,
    500: ERROR500,
  },
};
