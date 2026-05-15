import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.admin) {
    return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
  }
  next();
};
