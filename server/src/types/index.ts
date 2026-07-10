export interface SendEmailRequest {
  from: string;
  fromName: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
  replyTo?: string;
  appPassword: string;
}

export interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
  uptime: number;
}
