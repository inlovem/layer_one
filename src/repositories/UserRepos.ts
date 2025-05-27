import { User, UserInput } from '../types/userTypes';
import admin from '../utils/firebase';



export const userRepos = {
  /**
   * Saves user data to Firestore, both in the main collection and nested collections if applicable
   * 
   * @param userData - The user data to save
   * @param userId - The ID to use for the user document
   * @param options - Additional options for saving
   * @returns A Firestore batch with the write operations
   */
  async saveUserToFirestore(
    userData: any, 
    userId: string, 
    options: { 
      merge?: boolean, 
      companyId?: string, 
      locationId?: string 
    } = { merge: true }
  ): Promise<admin.firestore.WriteBatch> {
    const db = admin.firestore();
    const batch = db.batch();
    
    // Save to main users collection
    const userRef = db.collection('users').doc(userId);
    batch.set(userRef, userData, { merge: options.merge !== false });
    
    // Also save to the nested collection if companyId and locationId are available
    if (options.companyId && options.locationId) {
      const nestedUserRef = db
        .collection('locations')
        .doc(options.locationId)
        .collection('users')
        .doc(userId);
      
      batch.set(nestedUserRef, userData, { merge: options.merge !== false });
    }
    
    return batch;
  },

  /**
   * Saves multiple users to the database in a single batch
   * 
   * @param users - Array of users to save
   * @param options - Additional options for saving
   * @returns Promise that resolves when all users are saved
   */
  async saveUsersBatch(
    users: User[],
    options: { merge?: boolean; locationId?: string } = { merge: true }
  ): Promise<void> {
    const db = admin.firestore();
    const batch = db.batch();
  
    users.forEach((user) => {
      const userId = user.id;
      const mainRef = db.collection('users').doc(userId);
      batch.set(mainRef, user, { merge: options.merge });
  
      if (options.locationId) {
        const nestedRef = db
          .collection('locations')
          .doc(options.locationId)
          .collection('users')
          .doc(userId);
        batch.set(nestedRef, user, { merge: options.merge });
      }
    });
  
    await batch.commit();
  },

  /**
   * Saves multiple users to the database
   * 
   * @param users - Array of users to save
   * @returns Promise that resolves when all users are saved
   */
  async saveUsers(users: User[], companyId: string, locationId: string): Promise<void> {
    const db = admin.firestore();
    let batch = db.batch();
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
    
      // Use the shared function to add user to the batch
      batch = await this.saveUserToFirestore(
        user, 
        user.id, 
        { companyId, locationId }
      );
      
      // Firebase has a limit of 500 operations per batch
      if ((i + 1) % 400 === 0 && i < users.length - 1) {
        await batch.commit();
        batch = db.batch();
      }
    }
    
    await batch.commit();
  },

  /**
   * Creates or updates a user in the database
   * 
   * @param userData - The user data to save
   * @returns The ID of the created/updated user
   */
  async upsertUser(userData: UserInput): Promise<string> {
    const db = admin.firestore();
    
    // Determine which ID to use (id, userId, or generate a new one)
    const userId = userData.id || userData.userId || db.collection('users').doc().id;
    
    // Add timestamps
    const userWithTimestamps = {
      ...userData,
      id: userId,
      updatedAt: new Date(),
      createdAt: userData.id ? admin.firestore.FieldValue.serverTimestamp() : new Date()
    };
    
    // Use the shared function to create a batch with the user data
    const batch = await this.saveUserToFirestore(
      userWithTimestamps, 
      userId, 
      { 
        merge: true, 
        companyId: userData.companyId, 
        locationId: userData.locationId 
      }
    );
    
    // Commit the batch
    await batch.commit();
    
    return userId;
  },

  /**
   * Retrieves a user by ID, userId, or email
   * 
   * @param identifier - The ID, userId, or email of the user to retrieve
   * @param identifierType - The type of identifier ('id', 'userId', or 'email')
   * @returns The user data or null if not found
   */
  async getUser(identifier: string, identifierType: 'id' | 'userId' | 'email' = 'id'): Promise<any | null> {
    const db = admin.firestore();
    let querySnapshot;
    
    if (identifierType === 'id') {
      // Direct document lookup by ID
      const docSnapshot = await db.collection('users').doc(identifier).get();
      return docSnapshot.exists ? { id: docSnapshot.id, ...docSnapshot.data() } : null;
    } else {
      // Query by userId or email
      querySnapshot = await db.collection('users')
        .where(identifierType, '==', identifier)
        .limit(1)
        .get();
    }
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  },

  /**
   * Retrieves all user IDs associated with a specific location
   * 
   * @param locationId - The ID of the location to get users for
   * @returns An array of user IDs
   */
  async getUsersByLocationId(locationId: string): Promise<string[]> {
    const db = admin.firestore();
    
    try {
      console.log(`Fetching users for locationId: ${locationId}`);
      
      // First try to get users from the nested collection under the location
      const locationUsersRef = db.collection('locations').doc(locationId).collection('users');
      const querySnapshot = await locationUsersRef.get();
      
      if (!querySnapshot.empty) {
        const userIds = querySnapshot.docs.map(doc => doc.id);
        console.log(`Found ${userIds.length} users in locations/${locationId}/users`);
        return userIds;
      }
      
      // If no users found in nested collection, try the top-level users collection
      console.log(`No users found in nested collection, checking top-level users collection`);
      const topLevelUsersSnapshot = await db
        .collection('users')
        .where('locationId', '==', locationId)
        .get();
      
      if (!topLevelUsersSnapshot.empty) {
        const userIds = topLevelUsersSnapshot.docs.map(doc => doc.id);
        console.log(`Found ${userIds.length} users in top-level users collection with locationId: ${locationId}`);
        return userIds;
      }
      
      console.log(`No users found for locationId: ${locationId} in any collection`);
      return [];
    } catch (error) {
      console.error(`Error fetching users for locationId ${locationId}:`, error);
      throw error;
    }
  },

  /**
   * Deletes all users for a specific location or company
   * 
   * @param identifier - The ID of the location or company to delete users for
   * @param type - Optional parameter to specify if deleting by 'locationId' or 'companyId'
   */
  async deleteUsers(identifier: string, type: 'locationId' | 'companyId' = 'locationId'): Promise<void> {
    const db = admin.firestore();
    const MAX_BATCH_SIZE = 500; // Firestore limit
    
    // Delete from nested collection if it's a location
    if (type === 'locationId') {
      // Delete location-level users from nested collection
      const locationUsersRef = db.collection('locations').doc(identifier).collection('users');
      const locationUsersSnapshot = await locationUsersRef.get();
      
      await this.batchDelete(locationUsersSnapshot.docs, MAX_BATCH_SIZE);
    }
    
    if (type === 'companyId') {
      // Delete all users associated with the company
      const topLevelQuery = db.collection('users').where('companyId', '==', identifier);
      const topLevelSnapshot = await topLevelQuery.get();
      await this.batchDelete(topLevelSnapshot.docs, MAX_BATCH_SIZE);
    } else if (type === 'locationId') {
      // For location deletion, we need to handle the locationIds array in roles
      const usersQuery = db.collection('users');
      const usersSnapshot = await usersQuery.get();
      
      const docsToDelete = [];
      
      let batch = db.batch();
      let operationCount = 0;
      
      for (const doc of usersSnapshot.docs) {
        const userData = doc.data();
        
        // Check if user has roles with locationIds
        if (userData.roles && userData.roles.locationIds && 
            userData.roles.locationIds.includes(identifier)) {
          
          // Remove the locationId from the array
          const updatedLocationIds = userData.roles.locationIds.filter(
            (locId: string) => locId !== identifier
          );
          
          if (updatedLocationIds.length === 0) {
            // If no locations left, mark for deletion
            docsToDelete.push(doc);
          } else {
            // Verify that remaining locationIds exist in the locations collection
            const validLocationIds = [];
            for (const locId of updatedLocationIds) {
              const locationDoc = await db.collection('locations').doc(locId).get();
              if (locationDoc.exists) {
                validLocationIds.push(locId);
              }
            }
            
            if (validLocationIds.length === 0) {
              // If no valid locations left, mark for deletion
              docsToDelete.push(doc);
            } else {
              // Update the document with filtered and validated locationIds
              batch.update(doc.ref, {
                'roles.locationIds': validLocationIds,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
              });
              
              operationCount++;
              
              if (operationCount >= MAX_BATCH_SIZE) {
                await batch.commit();
                batch = db.batch();
                operationCount = 0;
              }
            }
          }
        }
      }
      
      // Commit any remaining updates
      if (operationCount > 0) {
        await batch.commit();
      }
      
      // Delete documents that no longer have any locations
      if (docsToDelete.length > 0) {
        await this.batchDelete(docsToDelete, MAX_BATCH_SIZE);
      }
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

