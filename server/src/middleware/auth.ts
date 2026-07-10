import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabase.js';
import { createError } from './errorHandler.js';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('Missing or invalid authorization header', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw createError('Invalid token', 401);
    }

    const isAdmin = user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin';
    
    if (!isAdmin) {
      throw createError('Forbidden: Admin role required', 403);
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};
