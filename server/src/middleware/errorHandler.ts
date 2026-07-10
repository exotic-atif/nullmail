import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export interface AppError extends Error {
  statusCode?: number;
  details?: unknown;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message = err.message || 'Internal server error';

  logger.error(`[${statusCode}] ${message}`, err.details ?? err.stack);

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export function createError(message: string, statusCode: number, details?: unknown): AppError {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.details = details;
  return error;
}
