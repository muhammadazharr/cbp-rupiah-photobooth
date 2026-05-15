import { Request } from 'express';

export interface AdminPayload {
  id: string;
  username: string;
}

export interface AuthRequest extends Request {
  admin?: AdminPayload;
}
