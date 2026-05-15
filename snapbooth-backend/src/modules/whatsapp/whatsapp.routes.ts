import express from 'express';
import { sendWhatsapp, getConfig, updateConfig } from './whatsapp.controller';
import { verifyToken } from '../../middleware/auth';
import { adminOnly } from '../../middleware/adminOnly';
import { asyncHandler } from '../../utils/asyncHandler';

const router = express.Router();

router.post('/send', asyncHandler(sendWhatsapp));
router.get('/config', verifyToken, adminOnly, asyncHandler(getConfig));
router.patch('/config', verifyToken, adminOnly, asyncHandler(updateConfig));

export default router;
