import axios from 'axios';
import { messageRepo } from '../repositories/MessageRepos';

/**
 * MessageService handles the processing of various types of messages
 * including SMS, calls, emails, and other communication channels.
 */
export const messageService = {
  /**
   * Handles an inbound SMS message
   * 
   * @param payload - The SMS message payload
   * @returns Promise that resolves when the message is processed
   */
  async handleInboundSMS(payload: any): Promise<void> {
    try {
      console.log('Processing inbound SMS:', payload.messageId);
      await messageRepo.storeMessage(payload);
    } catch (error) {
      console.error('Error handling inbound SMS:', error);
      throw error;
    }
  },

  /**
   * Handles an inbound call
   * 
   * @param payload - The call payload
   * @returns Promise that resolves when the call is processed
   */
  async handleInboundCall(payload: any): Promise<void> {
    try {
      console.log('Processing inbound call:', payload.messageId);
      
      // Handle different call statuses
      if (payload.status === 'voicemail') {
        console.log('Call went to voicemail');
      } else if (payload.status === 'completed') {
        console.log('Call was completed, duration:', payload.callDuration, 'seconds');
      }
      
      await messageRepo.storeMessage(payload);
    } catch (error) {
      console.error('Error handling inbound call:', error);
      throw error;
    }
  },

  /**
   * Handles an inbound email message
   * 
   * @param payload - The email message payload
   * @returns Promise that resolves when the email is processed
   */
  async handleInboundEmail(payload: any): Promise<void> {
    try {
      console.log('Processing inbound email:', payload.emailMessageId);
      await messageRepo.storeMessage(payload);
    } catch (error) {
      console.error('Error handling inbound email:', error);
      throw error;
    }
  },

  /**
   * Handles an outbound SMS message
   * 
   * @param payload - The SMS message payload
   * @returns Promise that resolves when the message is processed
   */
  async handleOutboundSMS(payload: any): Promise<void> {
    try {
      console.log('Processing outbound SMS:', payload.messageId);
      await messageRepo.storeMessage(payload);
    } catch (error) {
      console.error('Error handling outbound SMS:', error);
      throw error;
    }
  },

  /**
   * Handles an outbound call
   * 
   * @param payload - The call payload
   * @returns Promise that resolves when the call is processed
   */
  async handleOutboundCall(payload: any): Promise<void> {
    try {
      console.log('Processing outbound call:', payload.messageId);
      
      // Handle different call statuses
      if (payload.callStatus === 'voicemail') {
        console.log('Call reached voicemail');
      } else if (payload.status === 'completed') {
        console.log('Call was completed, duration:', payload.callDuration, 'seconds');
      }
      
      await messageRepo.storeMessage(payload);
    } catch (error) {
      console.error('Error handling outbound call:', error);
      throw error;
    }
  },

  /**
   * Handles an outbound email message
   * 
   * @param payload - The email message payload
   * @returns Promise that resolves when the email is processed
   */
  async handleOutboundEmail(payload: any): Promise<void> {
    try {
      console.log('Processing outbound email:', payload.emailMessageId);
      await messageRepo.storeMessage(payload);
    } catch (error) {
      console.error('Error handling outbound email:', error);
      throw error;
    }
  },

  /**
   * Handles an outbound voicemail message
   * 
   * @param payload - The voicemail message payload
   * @returns Promise that resolves when the voicemail is processed
   */
  async handleOutboundVoicemail(payload: any): Promise<void> {
    try {
      console.log('Processing outbound voicemail:', payload.messageId);
      await messageRepo.storeMessage(payload);
    } catch (error) {
      console.error('Error handling outbound voicemail:', error);
      throw error;
    }
  },


  /**
   * Sends an SMS message
   * 
   * @param messageData - The SMS message data to send
   * @param accessToken - The access token for authentication
   * @returns Promise with the API response
   */
  async sendSMS(messageData: any, accessToken: string): Promise<any> {
    try {
      const apiUrl = 'https://services.leadconnectorhq.com/conversations/messages';
      
      const payload = {
        locationId: messageData.locationId,
        contactId: messageData.contactId,
        body: messageData.body,
        messageType: 'SMS',
        attachments: messageData.attachments || []
      };
      
      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('SMS sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  },

  /**
   * Sends an email message
   * 
   * @param messageData - The email message data to send
   * @param accessToken - The access token for authentication
   * @returns Promise with the API response
   */
  async sendEmail(messageData: any, accessToken: string): Promise<any> {
    try {
      const apiUrl = 'https://services.leadconnectorhq.com/conversations/messages';
      
      const payload = {
        locationId: messageData.locationId,
        contactId: messageData.contactId,
        body: messageData.body,
        messageType: 'Email',
        subject: messageData.subject,
        attachments: messageData.attachments || [],
        to: messageData.to,
        cc: messageData.cc || [],
        bcc: messageData.bcc || []
      };
      
      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Email sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
};
