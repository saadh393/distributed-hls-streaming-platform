import { NextFunction, Request, Response } from "express";

interface errorType extends Error {}

export default function errorHandler(error: errorType, req: Request, res: Response, next: NextFunction) {
  let status_code: number = req.statusCode || 500;
  const default_: string = "Internal Server Error";
  let error_msg: string = error?.message || default_;

  res.status(status_code).json({
    status: "Error",
    message: error_msg,
  });
}
