import { NextFunction, Request, Response } from "express";
import { createErrorMap, fromError } from "zod-validation-error/v4";
import { z } from "zod/v4";

z.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

export default function validateRequest(schema: z.Schema) {
  return function (req: Request, res: Response, next: NextFunction): void {
    console.log(req.body);
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (e: any) {
      const validationError = fromError(e);
      console.log(validationError.toString());
      next(e);
    }
  };
}
