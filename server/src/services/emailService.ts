import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { ValidatedSendEmail } from '../utils/validation.js';
import { logger } from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

export interface SendEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

function createGmailTransporter(): Transporter {
  const email = process.env.SMTP_EMAIL;
  const appPassword = process.env.SMTP_PASSWORD;

  if (!email || !appPassword) {
    throw new Error('SMTP credentials are not configured in environment variables.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: appPassword,
    },
  });
}

export async function sendEmail(
  data: ValidatedSendEmail,
  attachments?: Express.Multer.File[]
): Promise<SendEmailResponse> {
  try {
    const transporter = createGmailTransporter();
    const senderEmail = process.env.SMTP_EMAIL!;
    const senderName = "Atif's Codeworks";

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: data.to.join(', '),
      subject: data.subject,
      html: data.html,
    };

    if (data.cc && data.cc.length > 0) {
      mailOptions.cc = data.cc.join(', ');
    }

    if (data.bcc && data.bcc.length > 0) {
      mailOptions.bcc = data.bcc.join(', ');
    }

    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments.map((file) => ({
        filename: file.originalname,
        content: file.buffer,
        contentType: file.mimetype,
      }));
    }

    const info = await transporter.sendMail(mailOptions);

    logger.success(`Email sent successfully: ${info.messageId}`);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error sending email';
    logger.error('Failed to send email', message);

    return {
      success: false,
      error: message,
    };
  }
}
