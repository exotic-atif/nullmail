// ===== EMAIL TYPES =====

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailAttachment {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  progress: number;
}

export interface EmailDraft {
  id: string;
  to: EmailRecipient[];
  cc: EmailRecipient[];
  bcc: EmailRecipient[];
  subject: string;
  html: string;
  attachments: Omit<EmailAttachment, 'file' | 'preview'>[];
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  html: string;
  thumbnail?: string;
}

export type TemplateCategory =
  | 'minimal'
  | 'newsletter'
  | 'launch'
  | 'welcome'
  | 'promotion'
  | 'event'
  | 'corporate'
  | 'receipt'
  | 'verification'
  | 'password-reset';

// ===== CONTACTS TYPES =====

export interface Contact {
  id: string;
  name: string;
  email: string;
  group?: string;
  isFavorite: boolean;
  createdAt: string;
  lastUsed?: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  color: string;
}

// ===== SETTINGS TYPES =====

export interface AppSettings {
  senderName: string;
  senderEmail: string;
  appPassword: string;
  replyTo: string;
  signature: string;
  defaultFont: string;
  theme: Theme;
}

export type Theme = 'dark' | 'light';

// ===== UI TYPES =====

export type SidebarView = 'compose' | 'drafts' | 'contacts' | 'templates' | 'settings';

export type PreviewMode = 'desktop' | 'mobile';

export type SendStatus = 'idle' | 'sending' | 'success' | 'error' | 'undoing';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}

// ===== API TYPES =====

export interface SendEmailPayload {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  html: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  messageId?: string;
}
