import { NextFunction, Request, Response } from "express";

interface ApiError extends Error {
  statusCode?: number;
}

export default function errorMiddleware(error: ApiError, req: Request, res: Response, next: NextFunction) {
  const statusCode = error.statusCode || 500;
  // Log the error (can be replaced with Winston or external logger)
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`);
  console.error(error.stack || error.message);

  res.status(statusCode).json({
    status: error,
    statusCode,
    message: error.message || "Internal Server Error",
  });
}
