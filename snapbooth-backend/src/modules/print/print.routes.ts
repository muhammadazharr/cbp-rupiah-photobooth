import express from 'express';
import { printSession, getPrintStatus, getPrinterConfig, updatePrinterConfig, printTest } from './print.controller';
import { verifyToken } from '../../middleware/auth';
import { adminOnly } from '../../middleware/adminOnly';
import { asyncHandler } from '../../utils/asyncHandler';

const router = express.Router();

router.post('/', asyncHandler(printSession));
router.get('/status/:printId', asyncHandler(getPrintStatus));
router.get('/config', verifyToken, adminOnly, asyncHandler(getPrinterConfig));
router.patch('/config', verifyToken, adminOnly, asyncHandler(updatePrinterConfig));
router.post('/test', verifyToken, adminOnly, asyncHandler(printTest));

export default router;
