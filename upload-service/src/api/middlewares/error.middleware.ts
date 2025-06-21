import { NextFunction, Request, Response } from "express";

interface ApiError extends Error {
  statusCode?: number;
}

export default function ErrorHandlingMiddleware(error: ApiError, req: Request, res: Response, next: NextFunction) {
  const statusCode: number = req.statusCode || 500;
  const defaultMessage: string = "Internal Server Error";

  res.status(statusCode).json({
    status: "Error",
    message: error?.message || defaultMessage,
  });
}
