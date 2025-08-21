import { NextFunction, Request, Response } from "express";

export default function notfoundMiddleware(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({
    success: false,
    message: `Route [${req.method}] ${req.originalUrl} not found.`,
  });
  return;
}
