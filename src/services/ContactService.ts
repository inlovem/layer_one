import admin from 'src/utils/firebase';
import { contactRepos } from '../repositories';
import axios from 'axios';

export const contactService = {
  /**
   * Fetches contacts for a specific location and saves them to the database
   * 
   * @param access_token - The access token for the GHL API
   * @param locationId - The ID of the location to fetch contacts for
   * @returns The number of contacts fetched from the API
   */
  async fetchAndSaveContacts(
    access_token: string,
    locationId: string
  ): Promise<number> {
    if (!locationId) {
      throw new Error('Location ID is required');
    }

    try {
      console.log(`Fetching contacts for location: ${locationId}`);
      
      // Initialize variables for pagination
      let allContacts: any[] = [];
      let hasMoreContacts = true;
      let searchAfter = null;
      const pageLimit = 100; // Fetch 100 contacts per request
      const maxRetries = 3;
      
      // Continue fetching until we have all contacts
      while (hasMoreContacts) {
        // Prepare request body
        const requestBody: any = {
          locationId,
          pageLimit
        };
        
        // Add searchAfter parameter for cursor-based pagination if available
        if (searchAfter) {
          requestBody.searchAfter = searchAfter;
        }
        
        let retryCount = 0;
        let success = false;
        let data;
        
        // Retry logic
        while (retryCount < maxRetries && !success) {
          try {
            // Make API request to GHL using axios
            const response = await axios({
              method: 'post',
              url: 'https://services.leadconnectorhq.com/contacts/search',
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Version': '2021-07-28',
                'Content-Type': 'application/json'
              },
              data: requestBody,
              timeout: 30000 // 30 second timeout
            });
            
            data = response.data;
            success = true;
          } catch (error: any) {
            retryCount++;
            console.warn(`Attempt ${retryCount} failed for location ${locationId}: ${error.message}`);
            
            if (axios.isAxiosError(error) && error.response) {
              console.error(`API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            
            if (retryCount >= maxRetries) {
              throw new Error(`Failed to fetch contacts after ${maxRetries} attempts: ${error.message}`);
            }
            
            // Exponential backoff
            const delay = 1000 * Math.pow(2, retryCount);
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
        
        // Add fetched contacts to our collection
        if (data.contacts && data.contacts.length > 0) {
          allContacts = [...allContacts, ...data.contacts];
          
          // Get searchAfter from the last contact for next pagination
          const lastContact = data.contacts[data.contacts.length - 1];
          searchAfter = lastContact.searchAfter;
          
          console.log(`Fetched ${data.contacts.length} contacts, total so far: ${allContacts.length}`);
          
          // If we received fewer contacts than the page limit, we've reached the end
          if (data.contacts.length < pageLimit) {
            hasMoreContacts = false;
          }
        } else {
          // No more contacts to fetch
          hasMoreContacts = false;
        }
      }
      
      console.log(`Total contacts fetched: ${allContacts.length}`);
      
      // Transform into the shape the batch helper expects
      const contactsToSave = allContacts.map(contact => ({
        contactData: contact,
        contactId: contact.id // assuming the contact has an id field
      }));
      
      // Save contacts to database using batch helper
      if (contactsToSave.length > 0) {
        await contactRepos.saveContactsBatch(contactsToSave, { locationId });
        console.log(`Successfully saved ${contactsToSave.length} contacts for location ${locationId}`);
      }
      
      return allContacts.length;
    } catch (error: any) {
      console.error(`Error fetching contacts for location ${locationId}:`, error.message);
      throw error;
    }
  },
  /**
   * Upserts a contact in the database
   * 
   * @param contactData - Contact data to upsert
   * @returns Promise with the contact ID
   */
  async upsertContact(contactData: {
    id: string;
    locationId: string;
    [key: string]: any;
  }): Promise<string> {
    try {
      console.log(`Upserting contact ${contactData.id} for location ${contactData.locationId}`);
      
      // Save the contact to the database
      await contactRepos.saveContactToFirestore(
        contactData,
        contactData.id,
        { locationId: contactData.locationId }
      );
      
      console.log(`Contact ${contactData.id} upserted successfully`);
      return contactData.id;
    } catch (error: any) {
      console.error(`Error upserting contact ${contactData.id}:`, error);
      throw new Error(`Failed to upsert contact: ${error.message}`);
    }
  },
   /**
   * Deletes all users for a specific location or company
   * 
   * @param identifier - The ID of the location or company to delete users for
   * @param type - Optional parameter to specify if deleting by 'locationId' or 'companyId'
   */
   async deleteContacts(identifier: string, type: 'locationId' | 'companyId' = 'locationId'): Promise<void> {
    try {
      await contactRepos.deleteContacts(identifier, type);
    } catch (error: any) {
      console.error(`Error deleting users for ${type} ${identifier}:`, error.message);
      throw error;
    }
  },
  /**
   * Deletes a contact from the database
   * 
   * @param contactId - ID of the contact to delete
   * @returns Promise that resolves when the contact is deleted
   */
  async deleteContact(contactId: string, locationId: string): Promise<void> {
    try {
      await contactRepos.deleteContact(contactId, {locationId});
    } catch (error: any) {
      console.error(`Error deleting contact ${contactId}:`, error.message);
      throw new Error(`Failed to delete contact: ${error.message}`);
    }
  }
}
