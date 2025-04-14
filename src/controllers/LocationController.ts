// src/controllers/LocationController.ts
import admin from "../utils/firebase";

interface LocationInput {
  type: 'LocationCreate' | 'LocationUpdate' | 'INSTALL';
  id: string;
  locationId?: string;
  companyId: string;
  name?: string;
  email?: string;
  stripeProductId?: string;
  appId?: string;
  installType?: string;
  userId?: string;
  planId?: string;
  trial?: any;
}

export async function locationController(variables: LocationInput) {
  try {
    const db = admin.firestore();
    // Use provided locationId if available, otherwise fall back to id.
    const docId = variables.locationId || variables.id;
    const locationRef = db.collection('locations').doc(docId);
    
    if (variables.type === 'INSTALL') {
      // For INSTALL, simulate an upsert:
      // - If the document exists, update companyId and appId.
      // - If not, create with default name and stripeProductId.
      const locationSnapshot = await locationRef.get();
      if (locationSnapshot.exists) {
        await locationRef.set({
          companyId: variables.companyId,
          appId: variables.appId || ''
        }, { merge: true });
      } else {
        await locationRef.set({
          locationId: variables.locationId,
          companyId: variables.companyId,
          appId: variables.appId || '',
          name: 'Default Location Name',
          stripeProductId: ''
        });
      }
      return;
    }
    
    // For LocationCreate or LocationUpdate, ensure required fields are present.
    if (!variables.name) {
      throw new Error("Name and email are required");
    }
    
    // For create/update, perform an upsert using a similar check:
    const locationSnapshot = await locationRef.get();
    if (locationSnapshot.exists) {
      // Document exists: update specified fields.
      await locationRef.set({
        companyId: variables.companyId,
        name: variables.name,
        email: variables.email || '',
        stripeProductId: variables.stripeProductId || '',
        appId: variables.appId || ''
      }, { merge: true });
    } else {
      // Document does not exist: create new document with all fields.
      await locationRef.set({
        locationId: docId,
        companyId: variables.companyId,
        name: variables.name,
        email: variables.email || '',
        stripeProductId: variables.stripeProductId || '',
        appId: variables.appId || ''
      });
    }
    return;
  } catch (error) {
    console.error(error);
    const action = variables.type === 'INSTALL'
      ? 'install'
      : variables.type === 'LocationCreate'
        ? 'create'
        : 'update';
    throw new Error(`Failed to ${action} location`);
  }
}
