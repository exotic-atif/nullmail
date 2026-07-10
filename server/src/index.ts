import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import emailRoutes from './routes/email.js';
import healthRoutes from './routes/health.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api', healthRoutes);
app.use('/api/email', emailRoutes);

// Error handling
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    logger.success(`NullMail server running on http://localhost:${PORT}`);
    logger.info(`CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  });
}

export default app;
