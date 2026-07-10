import { Router } from 'express';
import type { HealthResponse } from '../types/index.js';

const router = Router();
const startTime = Date.now();

router.get('/health', (_req, res) => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
  };
  res.json(response);
});

export default router;
