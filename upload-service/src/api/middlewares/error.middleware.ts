import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod/v4";

interface ApiError extends Error {
  issues: any;
  statusCode?: number;
}

export default function ErrorHandlingMiddleware(error: ApiError, req: Request, res: Response, next: NextFunction) {
  let statusCode: number = req.statusCode || 500;
  const defaultMessage: string = "Internal Server Error";

  let errorMessage = error?.message || defaultMessage;
  if (error instanceof ZodError) {
    statusCode = 400;
    errorMessage = error.issues.map((e: any) => e.message).join(" ");
  }

  console.log(JSON.stringify(error, null, 2));

  res.status(statusCode).json({
    status: "Error",
    message: errorMessage,
  });
}
