import express from 'express';
import { login, logout, getMe, changePassword } from './auth.controller';
import { verifyToken } from '../../middleware/auth';
import { adminOnly } from '../../middleware/adminOnly';
import { authLimiter } from '../../middleware/rateLimiter';
import { asyncHandler } from '../../utils/asyncHandler';

const router = express.Router();

router.post('/login', authLimiter, asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', verifyToken, asyncHandler(getMe));
router.post('/change-password', verifyToken, adminOnly, asyncHandler(changePassword));

export default router;
