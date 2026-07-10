import rateLimit from 'express-rate-limit';

export const emailRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    error: 'Too many emails sent. Please wait a moment before sending again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
