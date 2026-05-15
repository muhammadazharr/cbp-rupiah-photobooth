import { Request, Response } from 'express';
import * as printService from './print.service';
import { sendSuccess, sendError } from '../../utils/response';
import prisma from '../../config/database';

export const printSession = async (req: Request, res: Response) => {
  const { sessionId } = req.body;
  if (!sessionId) return sendError(res, 'sessionId is required', 400);

  try {
    const result = await printService.printSession(sessionId);
    return sendSuccess(res, 'Print job submitted', result);
  } catch (err: any) {
    if (err.message.includes('not found')) return sendError(res, err.message, 404);
    return sendError(res, err.message, 400);
  }
};

export const getPrintStatus = async (req: Request, res: Response) => {
  const print = await prisma.print.findUnique({ where: { id: req.params.printId } });
  if (!print) return sendError(res, 'Print job not found', 404);

  return sendSuccess(res, 'Print status fetched', { status: print.status });
};

export const getPrinterConfig = async (req: Request, res: Response) => {
  const ipConfig = await prisma.appConfig.findUnique({ where: { key: 'printer_ip' } });
  const portConfig = await prisma.appConfig.findUnique({ where: { key: 'printer_port' } });

  return sendSuccess(res, 'Printer config fetched', {
    printerIp: ipConfig?.value || '',
    printerPort: portConfig?.value || '',
    printerName: 'Default Printer',
  });
};

export const updatePrinterConfig = async (req: Request, res: Response) => {
  const { printerIp, printerPort } = req.body;

  if (printerIp) {
    await prisma.appConfig.upsert({
      where: { key: 'printer_ip' },
      update: { value: printerIp },
      create: { key: 'printer_ip', value: printerIp },
    });
  }

  if (printerPort) {
    await prisma.appConfig.upsert({
      where: { key: 'printer_port' },
      update: { value: printerPort },
      create: { key: 'printer_port', value: printerPort },
    });
  }

  return sendSuccess(res, 'Printer config updated');
};

export const printTest = async (req: Request, res: Response) => {
  try {
    await printService.printTestPage();
    return sendSuccess(res, 'Test page sent to printer');
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};
