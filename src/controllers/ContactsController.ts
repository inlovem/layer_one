import { Contact, Note } from "src/types/contactTypes.js";
import admin from "src/utils/firebase.js";

//
// Upsert Contact
//
export async function upsertContact(contact: Contact) {
  // Check that the required locationId is defined
  if (!contact.locationId) {
    console.error("Undefined locationId for contact:", contact);
    throw new Error("Foreign key constraint failed: locationId is undefined");
  }

  const db = admin.firestore();

  // Validate that the location exists in the "locations" collection
  const locationRef = db.collection('locations').doc(contact.locationId);
  const locationDoc = await locationRef.get();
  if (!locationDoc.exists) {
    console.error("Location not found for ID:", contact.locationId);
    throw new Error("Foreign key constraint failed: location not found");
  }

  try {
    const contactRef = db.collection('contacts').doc(contact.id);
    const doc = await contactRef.get();
    
    // Normalize email and name fields, with fallback defaults
    const emailValue =
      (contact.email && contact.email.trim() !== '') ? contact.email : 'default@placeholder.com';
    const nameValue =
      contact.name ? contact.name : `${contact.firstName || ""} ${contact.lastName || ""}`.trim();

    let data: any = {};
    if (!doc.exists) {
      // Create branch: build a new document with create-specific fields
      data = {
        ghlContactId: contact.id,
        ghlLocationId: contact.locationId,
        adress1: contact.address1,
        city: contact.city,
        companyName: contact.companyName,
        country: contact.country,
        dateAdded: contact.dateAdded ? new Date(contact.dateAdded) : undefined,
        dateOfBirth: contact.dateOfBirth,
        dnd: contact.dnd,
        email: emailValue,
        name: nameValue,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        title: undefined,
        linkedInUrl: undefined,
        tags: contact.tags || [],
        website: contact.website,
        attachments: contact.attachments,
        assignedTo: contact.assignedTo,
        customFields: contact.customFields ? JSON.stringify(contact.customFields) : undefined,
        private: false,
      };
    } else {
      // Update branch: build an update object, adding updatedAt timestamp
      data = {
        ghlLocationId: contact.locationId,
        adress1: contact.address1,
        city: contact.city,
        companyName: contact.companyName,
        country: contact.country,
        dateAdded: contact.dateAdded ? new Date(contact.dateAdded) : undefined,
        dateOfBirth: contact.dateOfBirth,
        dnd: contact.dnd,
        email: emailValue,
        name: nameValue,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phone: contact.phone,
        title: undefined,
        linkedInUrl: undefined,
        tags: contact.tags || [],
        website: contact.website,
        attachments: contact.attachments,
        assignedTo: contact.assignedTo,
        customFields: contact.customFields ? JSON.stringify(contact.customFields) : undefined,
        private: false,
        updatedAt: new Date(),
      };
    }

    // Remove properties that are undefined so Firestore doesn't store them
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);
    await contactRef.set(data, { merge: true });
  } catch (error) {
    console.error(error);
    throw new Error(
      `Failed to ${contact.type === "ContactCreate" ? "create" : "update"} carrier contact`
    );
  }
}

//
// Delete Contact
//
export async function deleteContact(id: string) {
  const db = admin.firestore();
  try {
    await db.collection('contacts').doc(id).delete();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete carrier contact");
  }
}

//
// Add Note
//
export async function addNote(note: Note): Promise<void | null> {
  const db = admin.firestore();
  try {
    // Fetch the contact document and check that it exists
    const contactRef = db.collection('contacts').doc(note.contactId);
    const contactDoc = await contactRef.get();
    if (!contactDoc.exists) {
      console.error("Contact not found for ID:", note.contactId);
      return null;
    }
    const contactData = contactDoc.data();
    // Verify that the contact's location matches the note's location
    if (!contactData || contactData.ghlLocationId !== note.locationId) {
      console.error("Contact location mismatch for ID:", note.contactId);
      return null;
    }

    // Determine ghlLocationId: use the contact's value if defined, else fallback to note.locationId
    const ghlLocationId = contactData.ghlLocationId || note.locationId;

    // Create the note in the "notes" collection using note.id as the document ID
    const noteRef = db.collection('notes').doc(note.id);
    const noteData: any = {
      ghlNoteId: note.id,
      ghlContactId: note.contactId,
      ghlLocationId: ghlLocationId,
      body: note.body,
      contactId: note.contactId, // Reference to the contact's ID
      locationId: contactData.locationId || note.locationId,
      createdAt: new Date(note.dateAdded || Date.now()),
    };

    // Clean up undefined properties before saving
    Object.keys(noteData).forEach(key => noteData[key] === undefined && delete noteData[key]);
    await noteRef.set(noteData);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to add note");
  }
}

//
// Delete Note
//
export async function deleteNote(id: string) {
  const db = admin.firestore();
  try {
    await db.collection('notes').doc(id).delete();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete note");
  }
}
