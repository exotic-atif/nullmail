import { Router } from 'express';
import { handleSendEmail } from '../controllers/emailController.js';
import { emailRateLimiter } from '../middleware/rateLimiter.js';
import { upload } from '../middleware/upload.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post(
  '/send',
  authMiddleware,
  emailRateLimiter,
  upload.array('attachments', 10),
  handleSendEmail
);

export default router;
