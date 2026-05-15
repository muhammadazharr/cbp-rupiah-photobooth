import { Request, Response } from 'express';
import * as templatesService from './templates.service';
import { sendSuccess, sendError } from '../../utils/response';

export const getTemplates = async (req: Request, res: Response) => {
  const templates = await templatesService.getTemplates();
  return sendSuccess(res, 'Templates fetched', templates);
};

export const getTemplate = async (req: Request, res: Response) => {
  const template = await templatesService.getTemplateById(req.params.id);
  if (!template) return sendError(res, 'Template not found', 404);
  return sendSuccess(res, 'Template fetched', template);
};

export const createTemplate = async (req: Request, res: Response) => {
  if (!req.file && !req.body.thumbnailUrl) return sendError(res, 'thumbnail is required', 400);

  try {
    const template = await templatesService.createTemplate(req.body, req.file);
    return sendSuccess(res, 'Template created', template);
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  try {
    const template = await templatesService.updateTemplate(req.params.id, req.body, req.file);
    return sendSuccess(res, 'Template updated', template);
  } catch (err: any) {
    if (err.message.includes('not found')) return sendError(res, err.message, 404);
    return sendError(res, err.message, 400);
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  try {
    await templatesService.deleteTemplate(req.params.id);
    return sendSuccess(res, 'Template deleted');
  } catch (err: any) {
    if (err.message.includes('not found')) return sendError(res, err.message, 404);
    return sendError(res, err.message, 400);
  }
};

export const toggleTemplate = async (req: Request, res: Response) => {
  try {
    const template = await templatesService.toggleTemplate(req.params.id);
    return sendSuccess(res, 'Template toggled', template);
  } catch (err: any) {
    if (err.message.includes('not found')) return sendError(res, err.message, 404);
    return sendError(res, err.message, 400);
  }
};
