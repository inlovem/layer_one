/**
 * DTOs for message handling
 */
export interface BaseMessageDTO {
    locationId: string;
    attachments: string[];
    body?: string;
    contactId: string;
    contentType?: string;
    conversationId: string;
    dateAdded: string;
    messageType: 'SMS' | 'CALL' | 'Email' | 'VOICEMAIL' | 'GMB' | 'FB' | 'IG' | 'Live Chat';
    status: string;
    messageId?: string;
    userId?: string;
    source?: string;
    conversationProviderId?: string;
}
  
export interface CallMessageDTO extends BaseMessageDTO {
    messageType: 'CALL';
    callDuration?: number;
    callStatus?: string;
}
  
export interface VoicemailMessageDTO extends BaseMessageDTO {
    messageType: 'VOICEMAIL';
}
  
export interface EmailMessageDTO extends BaseMessageDTO {
    messageType: 'Email';
    emailMessageId: string;
    threadId: string;
    provider?: string;
    to: string[];
    cc?: string[];
    bcc?: string[];
    from?: string;
    subject?: string;
}
  
// Inbound specific DTOs
export interface InboundMessageDTO extends BaseMessageDTO {
    type: 'InboundMessage';
    direction: 'inbound';
}
  
export interface InboundCallMessageDTO extends CallMessageDTO, InboundMessageDTO {
    messageType: 'CALL';
}
  
export interface InboundEmailMessageDTO extends EmailMessageDTO, InboundMessageDTO {
    messageType: 'Email';
}
  
// Outbound specific DTOs
export interface OutboundMessageDTO extends BaseMessageDTO {
    type: 'OutboundMessage';
    direction: 'outbound';
}
  
export interface OutboundCallMessageDTO extends CallMessageDTO, OutboundMessageDTO {
    messageType: 'CALL';
}
  
export interface OutboundVoicemailMessageDTO extends VoicemailMessageDTO, OutboundMessageDTO {
    messageType: 'VOICEMAIL';
}
  
export interface OutboundEmailMessageDTO extends EmailMessageDTO, OutboundMessageDTO {
    messageType: 'Email';
}
  
export type MessageDTO = BaseMessageDTO | CallMessageDTO | VoicemailMessageDTO | EmailMessageDTO;