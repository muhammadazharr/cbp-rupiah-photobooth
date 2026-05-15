import { Request, Response } from 'express';
import prisma from '../../config/database';
import { sendSuccess, sendError } from '../../utils/response';

export const getFilters = async (req: Request, res: Response) => {
  const filters = await prisma.filter.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } });
  return sendSuccess(res, 'Filters fetched', filters);
};

export const getFilter = async (req: Request, res: Response) => {
  const filter = await prisma.filter.findUnique({ where: { id: req.params.id } });
  if (!filter) return sendError(res, 'Filter not found', 404);
  return sendSuccess(res, 'Filter fetched', filter);
};

export const createFilter = async (req: Request, res: Response) => {
  const { name, cssFilter, thumbnailUrl } = req.body;
  if (!name || !cssFilter) return sendError(res, 'Name and cssFilter are required', 400);

  const filter = await prisma.filter.create({
    data: { name, cssFilter, thumbnailUrl },
  });
  return sendSuccess(res, 'Filter created', filter);
};

export const updateFilter = async (req: Request, res: Response) => {
  const existing = await prisma.filter.findUnique({ where: { id: req.params.id } });
  if (!existing) return sendError(res, 'Filter not found', 404);

  const filter = await prisma.filter.update({
    where: { id: req.params.id },
    data: req.body,
  });
  return sendSuccess(res, 'Filter updated', filter);
};

export const deleteFilter = async (req: Request, res: Response) => {
  const existing = await prisma.filter.findUnique({ where: { id: req.params.id } });
  if (!existing) return sendError(res, 'Filter not found', 404);

  await prisma.filter.update({
    where: { id: req.params.id },
    data: { isActive: false },
  });
  return sendSuccess(res, 'Filter deleted');
};
