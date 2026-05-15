import express from 'express';
import { getFilters, getFilter, createFilter, updateFilter, deleteFilter } from './filters.controller';
import { verifyToken } from '../../middleware/auth';
import { adminOnly } from '../../middleware/adminOnly';
import { asyncHandler } from '../../utils/asyncHandler';

const router = express.Router();

router.get('/', asyncHandler(getFilters));
router.get('/:id', asyncHandler(getFilter));
router.post('/', verifyToken, adminOnly, asyncHandler(createFilter));
router.patch('/:id', verifyToken, adminOnly, asyncHandler(updateFilter));
router.delete('/:id', verifyToken, adminOnly, asyncHandler(deleteFilter));

export default router;
