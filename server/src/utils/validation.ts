import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sendEmailSchema = z.object({
  to: z.array(z.string().regex(emailRegex, 'Invalid recipient email')).min(1, 'At least one recipient required'),
  cc: z.array(z.string().regex(emailRegex, 'Invalid CC email')).optional().default([]),
  bcc: z.array(z.string().regex(emailRegex, 'Invalid BCC email')).optional().default([]),
  subject: z.string().min(1, 'Subject is required').max(998),
  html: z.string().min(1, 'Email body is required'),
});

export type ValidatedSendEmail = z.infer<typeof sendEmailSchema>;
