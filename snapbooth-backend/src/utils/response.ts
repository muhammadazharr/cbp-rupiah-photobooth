import { Response } from 'express';

export const sendSuccess = (res: Response, message: string, data?: any, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, message: string, statusCode = 400, errors?: any) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export const sendPagination = (res: Response, message: string, data: any[], pagination: any) => {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};
