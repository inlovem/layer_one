 
 import admin from 'firebase-admin';


 export const messageRepo = { 
 
 /**
   * Stores a message in the database
   * 
   * @param messageData - The message data to store
   * @returns Promise that resolves when the message is stored
   */
 async storeMessage(messageData: any): Promise<string> {
    try {
      const db = admin.firestore();
      const messagesRef = db.collection('messages');
      
      // Create a new message document
      const messageDoc = {
        ...messageData,
        processedAt: new Date()
      };
      
      const docRef = await messagesRef.add(messageDoc);
      console.log(`Message stored with ID: ${docRef.id}`);
      
      return docRef.id;
    } catch (error) {
      console.error('Error storing message:', error);
      throw error;
    }
  }
}