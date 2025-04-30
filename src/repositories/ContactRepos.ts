import admin from '../utils/firebase';


export const contactRepos = {

  /**
   * Saves a contact to Firestore in both main and nested collections
   * 
   * @param contactData - The contact data to save
   * @param contactId - The ID of the contact
   * @param options - Options for saving (merge, companyId, locationId)
   * @returns A Firestore batch with the operations
   */
  async saveContactToFirestore(
    contactData: any, 
    contactId: string, 
    options: { 
      merge?: boolean, 
      companyId?: string, 
      locationId?: string 
    } = { merge: true }
  ): Promise<admin.firestore.WriteBatch> {
    const db = admin.firestore();
    const batch = db.batch();
    
    // Save to main contacts collection
    const contactRef = db.collection('contacts').doc(contactId);
    batch.set(contactRef, contactData, { merge: options.merge !== false });
    
    // Also save to the nested collection if locationId is available
    if (options.locationId) {
      const nestedContactRef = db
        .collection('locations')
        .doc(options.locationId)
        .collection('contacts')
        .doc(contactId);
      
      batch.set(nestedContactRef, contactData, { merge: options.merge !== false });
    }
    
    return batch;
  },

  /**
   * Saves multiple contacts in a batch operation
   * 
   * @param contacts - Array of contact data and IDs to save
   * @param options - Options for saving (merge, companyId, locationId)
   * @returns Promise that resolves when the batch is committed
   */
  async saveContactsBatch(
    contacts: Array<{ contactData: any; contactId: string }>,
    options: { merge?: boolean; companyId?: string; locationId?: string } = { merge: true }
  ): Promise<void> {
    const db = admin.firestore();
    const MAX_BATCH_SIZE = 400; // Keep below Firestore's 500 limit
    let batch = db.batch();
    let operationCount = 0;
  
    for (const { contactData, contactId } of contacts) {
      // Save to main contacts collection
      const mainRef = db.collection('contacts').doc(contactId);
      batch.set(mainRef, contactData, { merge: options.merge });
      operationCount++;
  
      // Save to nested collection if locationId is provided
      if (options.locationId) {
        const nestedRef = db
          .collection('locations')
          .doc(options.locationId)
          .collection('contacts')
          .doc(contactId);
        batch.set(nestedRef, contactData, { merge: options.merge });
        operationCount++;
      }

      
      // Commit batch when approaching the limit
      if (operationCount >= MAX_BATCH_SIZE) {
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
      }
    }
  
    // Commit any remaining operations
    if (operationCount > 0) {
      await batch.commit();
    }
  },

  /**
   * Saves multiple contacts to the database
   * 
   * @param contacts - Array of contacts to save
   * @param companyId - The ID of the company
   * @param locationId - The ID of the location
   * @returns Promise that resolves when all contacts are saved
   */
  async saveContacts(contacts: any[], companyId: string, locationId: string): Promise<void> {
    const db = admin.firestore();
    let batch = db.batch();
    let operationCount = 0;
    
    for (const contact of contacts) {
      // Use the shared function to add contact to the batch
      batch = await this.saveContactToFirestore(
        contact, 
        contact.id, 
        { companyId, locationId }
      );
      
      operationCount += 2; // Two operations per contact (main + nested)
      
      // Firebase has a limit of 500 operations per batch
      if (operationCount >= 400) {
        await batch.commit();
        batch = db.batch();
        operationCount = 0;
      }
    }
    
    if (operationCount > 0) {
      await batch.commit();
    }
  },

  /**
   * Creates or updates a contact in the database
   * 
   * @param contactData - The contact data to save
   * @returns The ID of the created/updated contact
   */
  async upsertContact(contactData: any): Promise<string> {
    const db = admin.firestore();
    
    // Determine which ID to use (id or generate a new one)
    const contactId = contactData.id || db.collection('contacts').doc().id;
    
    // Add timestamps
    const contactWithTimestamps = {
      ...contactData,
      id: contactId,
      updatedAt: new Date(),
      createdAt: contactData.id ? admin.firestore.FieldValue.serverTimestamp() : new Date()
    };
    
    // Use the shared function to create a batch with the contact data
    const batch = await this.saveContactToFirestore(
      contactWithTimestamps, 
      contactId, 
      { 
        merge: true, 
        companyId: contactData.companyId, 
        locationId: contactData.locationId 
      }
    );
    
    // Commit the batch
    await batch.commit();
    
    return contactId;
  },

  /**
   * Retrieves a contact by ID or other identifier
   * 
   * @param identifier - The ID or other identifier of the contact to retrieve
   * @param identifierType - The type of identifier ('id', 'email', etc.)
   * @returns The contact data or null if not found
   */
  async getContact(identifier: string, identifierType: 'id' | 'email' = 'id'): Promise<any | null> {
    const db = admin.firestore();
    let querySnapshot;
    
    if (identifierType === 'id') {
      const docRef = db.collection('contacts').doc(identifier);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        return null;
      }
      
      return { id: doc.id, ...doc.data() };
    }
    
    // For other identifier types, perform a query
    querySnapshot = await db.collection('contacts')
      .where(identifierType, '==', identifier)
      .limit(1)
      .get();
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  /**
   * Deletes a contact from the database
   * 
   * @param contactId - The ID of the contact to delete
   * @param options - Options containing locationId
   */
  async deleteContact(contactId: string, options: { locationId: string }): Promise<void> {
    const db = admin.firestore();
    
    // Delete from main contacts collection
    const contactRef = db.collection('contacts').doc(contactId);
    await contactRef.delete();
    
    // Delete from nested location collection
    const locationContactRef = db
      .collection('locations')
      .doc(options.locationId)
      .collection('contacts')
      .doc(contactId);
    await locationContactRef.delete();
  },


   /**
   * Deletes all contacts for a specific location or company
   * 
   * @param identifier - The ID of the location or company to delete contacts for
   * @param type - Optional parameter to specify if deleting by 'locationId' or 'companyId'
   * @returns Promise that resolves when all contacts are deleted
   */
   async deleteContacts(identifier: string, type: 'locationId' | 'companyId' = 'locationId'): Promise<void> {
    try {
      console.log(`Deleting all contacts for ${type}: ${identifier}`);
      
      const db = admin.firestore();
      const MAX_BATCH_SIZE = 500; // Firestore limit
      
      if (type === 'locationId') {
        // Delete location-level contacts from nested collection
        const locationContactsRef = db.collection('locations').doc(identifier).collection('contacts');
        const locationContactsSnapshot = await locationContactsRef.get();
        
        await this.batchDelete(locationContactsSnapshot.docs, MAX_BATCH_SIZE);
        console.log(`Deleted ${locationContactsSnapshot.size} contacts from location's nested collection`);
        
        // Delete all contacts associated with the location from top-level collection
        const topLevelQuery = db.collection('contacts').where('locationId', '==', identifier);
        const topLevelSnapshot = await topLevelQuery.get();
        await this.batchDelete(topLevelSnapshot.docs, MAX_BATCH_SIZE);
        console.log(`Deleted ${topLevelSnapshot.size} contacts associated with location`);
      } else if (type === 'companyId') {
        // Delete all contacts associated with the company
        const topLevelQuery = db.collection('contacts').where('companyId', '==', identifier);
        const topLevelSnapshot = await topLevelQuery.get();
        await this.batchDelete(topLevelSnapshot.docs, MAX_BATCH_SIZE);
        console.log(`Deleted ${topLevelSnapshot.size} contacts associated with company`);
      }
      
      console.log(`Successfully deleted all contacts for ${type}: ${identifier}`);
    } catch (error: any) {
      console.error(`Error deleting contacts for ${type}: ${identifier}:`, error);
      throw new Error(`Failed to delete contacts: ${error.message}`);
    }
  },
  
  /**
   * Helper method to delete documents in batches
   * 
   * @param docs - Array of document snapshots to delete
   * @param batchSize - Maximum batch size
   */
  async batchDelete(docs: FirebaseFirestore.QueryDocumentSnapshot[], batchSize: number): Promise<void> {
    const db = admin.firestore();
    
    if (docs.length <= batchSize) {
      // Can use a single batch
      const batch = db.batch();
      docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    } else {
      // Need to use multiple batches
      let currentBatch = db.batch();
      let operationCount = 0;
      
      for (const doc of docs) {
        currentBatch.delete(doc.ref);
        operationCount++;
        
        if (operationCount >= batchSize) {
          await currentBatch.commit();
          currentBatch = db.batch();
          operationCount = 0;
        }
      }
      
      // Commit any remaining operations
      if (operationCount > 0) {
        await currentBatch.commit();
      }
    }
  }

};
