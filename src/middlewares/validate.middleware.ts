import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

type ValidationSchema = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export const validate = (schema: ValidationSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        const result = schema.body.safeParse(req.body);
        if (!result.success) {
          res.status(400).json({ error: result.error.flatten() });
          return;
        }
        Object.assign(req.body, result.data);
      }

      if (schema.params) {
        const result = schema.params.safeParse(req.params);
        if (!result.success) {
          res.status(400).json({ error: result.error.flatten() });
          return;
        }
        Object.assign(req.params, result.data);
      }

      if (schema.query) {
        const result = schema.query.safeParse(req.query);
        if (!result.success) {
          res.status(400).json({ error: result.error.flatten() });
          return;
        }
        Object.assign(req.query, result.data);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
