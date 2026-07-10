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

    // Check role in the 'users' table
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (userData?.role !== 'admin') {
      throw createError('Forbidden: Admin role required', 403);
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};
