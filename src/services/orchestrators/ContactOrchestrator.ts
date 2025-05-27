import { contactService } from '../ContactService';
import { FastifyError } from 'fastify';
import { LocationWithToken } from '../../types/locationTypes'; 
/**
 * ContactOrchestrator handles the orchestration of contact-related operations
 * including creation, updates, and deletion of contact data across the system.
 */
export const contactOrchestrator = {
  /**
   * Upserts a contact in the system based on webhook data
   * 
   * @param contactData - Contact data from webhook
   * @returns Promise that resolves when the contact is upserted
   */
  async upsert(contactData: {
    id: string;
    locationId: string;
    type: string;
    [key: string]: any;
  }): Promise<string> {
    try {
      console.log(`Processing ${contactData.type} for contact ${contactData.id}`);
      
      if (!contactData.id || !contactData.locationId) {
        const err = new Error('Contact ID and location ID are required');
        (err as FastifyError).statusCode = 400;
        throw err;
      }
      
      // Delegate to the contact service for the actual upsert operation
      const contactId = await contactService.upsertContact(contactData);
      console.log(`Successfully upserted contact ${contactId}`);
      
      return contactId;
    } catch (error: any) {
      console.error(`Error in contactOrchestrator.upsert:`, error);
      throw new Error(`Failed to upsert contact: ${error.message}`);
    }
  },
  
  /**
   * Deletes a contact from the system
   * 
   * @param contactId - The ID of the contact to delete
   * @returns Promise that resolves when the contact is deleted
   */
  async delete(contactId: string, locationId: string): Promise<void> {
    try {
      console.log(`Processing delete for contact ${contactId}`);
      
      if (!contactId) {
        const err = new Error('Contact ID is required');
        (err as FastifyError).statusCode = 400;
        throw err;
      }
      
      // Delegate to the contact service for the actual delete operation
      await contactService.deleteContact(contactId, locationId);
      console.log(`Successfully deleted contact ${contactId}`);
    } catch (error: any) {
      console.error(`Error in contactOrchestrator.delete:`, error);
      throw new Error(`Failed to delete contact: ${error.message}`);
    }
  },


  async installContacts(locationTokens: LocationWithToken[]) {   // Fetch and save contacts from GHL
    for (const locationToken of locationTokens) {
      await contactService.fetchAndSaveContacts(
        locationToken.access_token,
        locationToken.locationId
      );
    }
  }
};
