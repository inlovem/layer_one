import { tokenRepos } from '../../repositories/TokenRepos';
import { messageService } from '../MessageService';
import {
  EmailMessageDTO,
  InboundMessageDTO,
  InboundCallMessageDTO,
  InboundEmailMessageDTO,
  OutboundMessageDTO,
  OutboundCallMessageDTO,
  OutboundEmailMessageDTO,
  OutboundVoicemailMessageDTO,
  MessageDTO
} from '../../types/dto/messageDTO';
/**
 * MessageOrchestrator handles the orchestration of message-related operations
 * including processing inbound and outbound messages across different channels.
 */
export const messageOrchestrator = {
  /**
   * Processes an inbound message based on its type
   * 
   * @param payload - The message payload from the webhook
   * @returns Promise that resolves when the message is processed
   */
  async processInboundMessage(payload: InboundMessageDTO): Promise<void> {
    const { messageType } = payload;
    
    try {
      console.log(`Processing inbound ${messageType} message`);
      
      if (messageType === 'SMS') {
        await messageService.handleInboundSMS(payload);
      } else if (messageType === 'CALL') {
        await messageService.handleInboundCall(payload as InboundCallMessageDTO);
      } else if (messageType === 'Email') {
        await messageService.handleInboundEmail(payload as InboundEmailMessageDTO);
      } else {
        console.warn(`Unhandled inbound message type: ${messageType}`);
      }
    } catch (error: any) {
      console.error(`Error processing inbound ${messageType} message:`, error);
      throw new Error(`Failed to process inbound message: ${error.message}`);
    }
  },

  /**
   * Processes an outbound message based on its type
   * 
   * @param payload - The message payload from the webhook
   * @returns Promise that resolves when the message is processed
   */
  async processOutboundMessage(payload: OutboundMessageDTO): Promise<void> {
    const { messageType } = payload;
    
    try {
      console.log(`Processing outbound ${messageType} message`);
      
      if (messageType === 'SMS') {
        await messageService.handleOutboundSMS(payload);
      } else if (messageType === 'CALL') {
        await messageService.handleOutboundCall(payload as OutboundCallMessageDTO);
      } else if (messageType === 'Email') {
        await messageService.handleOutboundEmail(payload as OutboundEmailMessageDTO);
      } else if (messageType === 'VOICEMAIL') {
        await messageService.handleOutboundVoicemail(payload as OutboundVoicemailMessageDTO);
      } else {
        console.warn(`Unhandled outbound message type: ${messageType}`);
      }
    } catch (error: any) {
      console.error(`Error processing outbound ${messageType} message:`, error);
      throw new Error(`Failed to process outbound message: ${error.message}`);
    }
  },

  /**
   * Sends a message using the appropriate service based on message type
   * 
   * @param messageData - The message data to send
   * @param locationId - The location ID associated with the message
   * @param companyId - The company ID associated with the message
   * @returns Promise with the result of the send operation
   */
  async sendMessage(messageData: Partial<MessageDTO>, locationId: string, companyId: string): Promise<any> {
    try {
      // Get the location token for authentication
      const token = await tokenRepos.getToken(companyId, 'Location', locationId);
      
      if (!token || !token.access_token) {
        throw new Error(`No valid token found for locationId: ${locationId}`);
      }
      
      const { messageType } = messageData;
      
      // Route to the appropriate message sending function based on type
      if (messageType === 'SMS') {
        return await messageService.sendSMS(messageData, token.access_token);
      } else if (messageType === 'Email') {
        return await messageService.sendEmail(messageData as Partial<EmailMessageDTO>, token.access_token);
      } else {
        throw new Error(`Unsupported message type for sending: ${messageType}`);
      }
    } catch (error: any) {
      console.error(`Error sending message:`, error);
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }
};
