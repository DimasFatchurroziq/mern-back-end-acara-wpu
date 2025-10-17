import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { apiError } from "../helpers/apiError.js";

type ValidationSchema = {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
};

export const validate =
  (schema: ValidationSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        const result = schema.body.safeParse(req.body);
        if (!result.success) {
          throw apiError.badRequest("Invalid body data", result.error.flatten());
        }
        req.body = result.data;
      }

      if (schema.params) {
        const result = schema.params.safeParse(req.params);
        if (!result.success) {
          throw apiError.badRequest("Invalid URL parameters", result.error.flatten());
        }
        req.params = result.data;
      }

      if (schema.query) {
        const result = schema.query.safeParse(req.query);
        if (!result.success) {
          throw apiError.badRequest("Invalid query parameters", result.error.flatten());
        }
        req.query = result.data;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
