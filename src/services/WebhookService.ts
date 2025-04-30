
import { locationOrchestrator } from './orchestrators/LocationOrchestrator';
import { agencyOrchestrator } from './orchestrators/AgencyOrchestrator';
import { userOrchestrator } from './orchestrators/UserOrchestrator';
import { installationOrchestrator } from './orchestrators/InstallationOrchestrator';
import { contactOrchestrator } from './orchestrators/ContactOrchestrator';
// import { contactService }      from './ContactService';
// import { noteService }         from './NoteService';
import {
 messageOrchestrator
} from './orchestrators/MessageOrchestrator';

export async function handleGHLWebhook(payload: any): Promise<void> {
  const {
    type,
    appId,
    companyId,
    locationId,
    installType,
    userId,
    planId,
    trial,
    id,
    firstName,
    lastName,
    email,
    phone,
    extension,
    role,
    permissions,
    messageType,
    ...rest
  } = payload;

  switch (type) {
    case 'INSTALL':
      if (locationId) {
        await locationOrchestrator.install(locationId, { companyId, appId });
      }
      break;

    case 'UNINSTALL':
      await installationOrchestrator.processUninstallation(payload);
      break;

    case 'UserCreate':
    case 'UserUpdate':
      await userOrchestrator.upsert({
        id,
        locationId,
        companyId,
        firstName,
        lastName,
        email,
        phone,
        extension,
        role,
        permissions,
        type,
        locations: payload.locations || [],
      });
      break;

    case 'LocationCreate':
    case 'LocationUpdate':
      await locationOrchestrator[type === 'LocationCreate' ? 'create' : 'update'](
        id,
        {
          companyId,
          name: payload.name,
          email: payload.email,
          stripeProductId: payload.stripeProductId,
          appId
        }
      );
      if (type === 'LocationCreate') {
        await locationOrchestrator.create(payload);
      }
      break;

    case 'ContactCreate':
    case 'ContactUpdate':
      await contactOrchestrator.upsert({
        id,
        locationId,
        ...rest,
        type,
      });
      break;

    case 'ContactDelete':
      await contactOrchestrator.delete(id, locationId);
      break;

    // case 'NoteCreate':
    //   await noteService.add({ id, ...rest, type });
    //   break;

    case 'InboundMessage':
      if (messageType === 'SMS')       await messageOrchestrator.processInboundMessage({ ...payload });
      else if (messageType === 'CALL')  await messageOrchestrator.processInboundMessage({ ...payload });
      else if (messageType === 'Email') await messageOrchestrator.processInboundMessage({ ...payload });
      break;

    case 'OutboundMessage':
      if (messageType === 'SMS')        await messageOrchestrator.processOutboundMessage({ ...payload });
      else if (messageType === 'CALL')   await messageOrchestrator.processOutboundMessage({ ...payload });
      else if (messageType === 'Email')  await messageOrchestrator.processOutboundMessage({ ...payload });
      else if (messageType === 'VOICEMAIL') await messageOrchestrator.processOutboundMessage({ ...payload });
      break;

    default:
      // silently ignore unknown event types, or log if you prefer
      console.warn(`Unhandled GHL event type: ${type}`);
  }
}