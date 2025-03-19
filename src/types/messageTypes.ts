// Base interface for all messages
interface MessageBase {
  type: "InboundMessage" | "OutboundMessage";
  locationId: string;
  attachments: any[];
  body?: string;
  contactId: string;
  conversationId: string;
  dateAdded: string;
  direction: "inbound" | "outbound";
  status: string;
  messageId?: string;
  userId?: string;
  conversationProviderId: string;
}

// SMS message interface
export interface SMSMessage extends MessageBase {
  messageType: "SMS";
  contentType: string;
}

// Call message interface
export interface CallMessage extends MessageBase {
  messageType: "CALL";
  callDuration: number;
  callStatus: "completed" | "voicemail" | string;
}

// Email message interface
export interface EmailMessage extends MessageBase {
  messageType: "Email";
  emailMessageId: string;
  threadId: string;
  provider: string;
  subject?: string;
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
}

// Union type for any message
export type AnyMessage = SMSMessage | CallMessage | EmailMessage;
