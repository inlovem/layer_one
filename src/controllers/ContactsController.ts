
import { Contact, Note } from "src/types/contactTypes.js";
import { prisma } from "../utils/prismaClient.js";
import { create } from "domain";



export async function upsertContact(contact: Contact) {

  const locationExists = await prisma.location.findUnique({
    where: { locationId: contact.locationId },
  });

  if (!locationExists) {
    console.error("Location not found for ID:", contact.locationId);
    throw new Error("Foreign key constraint failed: location not found");
  }

  try {
    await prisma.contact.upsert({
      where: {
        ghlContactId: contact.id,
      },
      create: {
        ghlContactId: contact.id,
        ghlLocationId: contact.locationId,
        adress1: contact.address1,
        city: contact.city,
        companyName: contact.companyName,
        country: contact.country,
        dateAdded: contact.dateAdded ? new Date(contact.dateAdded) : undefined,
        dateOfBirth: contact.dateOfBirth,
        dnd: contact.dnd,
        email: contact.email?.trim() && contact.email.trim() !== '' 
          ? contact.email 
          : 'default@placeholder.com',
        name: contact.name 
          ? contact.name 
          : `${contact.firstName || ""} ${contact.lastName || ""}`.trim(),
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
      },
      update: {
        ghlLocationId: contact.locationId,
        adress1: contact.address1,
        city: contact.city,
        companyName: contact.companyName,
        country: contact.country,
        dateAdded: contact.dateAdded ? new Date(contact.dateAdded) : undefined,
        dateOfBirth: contact.dateOfBirth,
        dnd: contact.dnd,
        email: contact.email || 'default@placeholder.com',
        name: contact.name 
          ? contact.name 
          : `${contact.firstName || ""} ${contact.lastName || ""}`.trim(),
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
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error(
      `Failed to ${contact.type === "ContactCreate" ? "create" : "update"} carrier contact`
    );
  }
}


export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({
      where: {
        ghlContactId: id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete carrier contact");
  }
}


export async function addNote(note : Note): Promise<void | null>   {
  try{
    const contactWithLocation = await prisma.contact.findUnique({
      where: { 
        ghlContactId: note.contactId,
        location:{
          is: {
            ghlLocationId: note.locationId,
        },
       },
      },
      include: { location: true }
    });   
    
    if (!contactWithLocation) {
      console.error("Contact not found for ID:", note.contactId);
      return null;
    }

    await prisma.note.create({
      data: {
        ghlNoteId: note.id,
        ghlContactId: note.contactId,
        ghlLocationId: contactWithLocation.location.locationId || note.locationId,
        body: note.body,
        contactId: contactWithLocation.id,
        locationId: contactWithLocation.location.id,
        createdAt: new Date(note.dateAdded || Date.now()),
      },
    });
  }
  catch (error) {
    console.error(error);
    throw new Error("Failed to add note");
  }
}

export async function deleteNote(id: string) {
  try {
    await prisma.note.delete({
      where: {
        ghlNoteId: id,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete note");
  }
}

