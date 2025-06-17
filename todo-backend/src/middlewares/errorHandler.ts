import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = error?.status || 500;
  const message = error?.message || error;

  res.status(status).send({
    status: 'FAILED',
    data: { error: message },
  });
};