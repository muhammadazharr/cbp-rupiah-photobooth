import { AuthRequest } from '../../types';
import { sendSuccess, sendError } from '../../utils/response';
import * as authService from './auth.service';

export const login = async (req: AuthRequest, res: any) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return sendError(res, 'Username and password are required', 400);
  }

  const result = await authService.loginAdmin(username, password);
  if (!result) {
    return sendError(res, 'Invalid credentials', 401);
  }

  return sendSuccess(res, 'Login successful', result);
};

export const logout = async (req: AuthRequest, res: any) => {
  // Logout is client-side, but we can log it here
  return sendSuccess(res, 'Logout successful');
};

export const getMe = async (req: AuthRequest, res: any) => {
  if (!req.admin) return sendError(res, 'Not authenticated', 401);
  const admin = await authService.getAdminById(req.admin.id);
  if (!admin) return sendError(res, 'Admin not found', 404);

  return sendSuccess(res, 'Admin profile fetched', admin);
};

export const changePassword = async (req: AuthRequest, res: any) => {
  const { oldPassword, newPassword } = req.body;
  if (!req.admin) return sendError(res, 'Not authenticated', 401);

  if (!oldPassword || !newPassword) {
    return sendError(res, 'Old and new passwords are required', 400);
  }

  const success = await authService.changePassword(req.admin.id, oldPassword, newPassword);
  if (!success) {
    return sendError(res, 'Invalid old password', 400);
  }

  return sendSuccess(res, 'Password changed successfully');
};
