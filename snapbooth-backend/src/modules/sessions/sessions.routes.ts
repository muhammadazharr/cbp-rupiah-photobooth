import express from 'express';
import { createSession, getSession, completeSession, deleteSession } from './sessions.controller';
import { verifyToken } from '../../middleware/auth';
import { adminOnly } from '../../middleware/adminOnly';
import { asyncHandler } from '../../utils/asyncHandler';

const router = express.Router();

router.post('/', asyncHandler(createSession));
router.get('/:id', asyncHandler(getSession));
router.patch('/:id/complete', asyncHandler(completeSession));
router.delete('/:id', verifyToken, adminOnly, asyncHandler(deleteSession));

export default router;
