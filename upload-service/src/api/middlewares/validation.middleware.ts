import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { zodErrorToFieldErrors } from "../../utils/zod-error-to-field-errors";

export const validator =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const { fieldErrors, details } = zodErrorToFieldErrors(result.error);

      res.status(422).json({
        message: "Invalid input",
        code: "VALIDATION_ERROR",
        fieldErrors,
        details,
      });
      return;
    }

    // req.body = result;
    return next();
  };
