import type { Request, Response, NextFunction } from 'express';
import { sendEmailSchema } from '../utils/validation.js';
import { sendEmail } from '../services/emailService.js';
import { createError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { generateEmailHTML } from '../templates/wrapper.js';

export async function handleSendEmail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Parse JSON body — attachments are sent separately as multipart
    const bodyData = req.body.data ? JSON.parse(req.body.data) : req.body;

    const parsed = sendEmailSchema.safeParse(bodyData);

    if (!parsed.success) {
      const details = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      throw createError('Validation failed', 400, details);
    }

    const attachments = req.files as Express.Multer.File[] | undefined;

    logger.info(`Sending email to ${parsed.data.to.join(', ')}`);

    // Wrap the HTML content with the custom branded template
    parsed.data.html = generateEmailHTML(parsed.data.html);

    const result = await sendEmail(parsed.data, attachments);

    if (!result.success) {
      throw createError(result.error || 'Failed to send email', 500);
    }

    res.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    next(error);
  }
}
