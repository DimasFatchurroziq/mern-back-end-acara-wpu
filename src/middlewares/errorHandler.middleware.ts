import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { apiError } from "../helpers/apiError.js";

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("🔥 Error caught:", err);

  // 1️⃣ Custom apiError
  if (err instanceof apiError) {
    res.status(err.statusCode).json({
      meta: {
        status: err.statusCode,
        message: err.message,
      },
      data: err.data ?? null,
    });
    return;
  }

  // 2️⃣ Zod validation error
  if (err instanceof ZodError) {
    res.status(400).json({
      meta: {
        status: 400,
        message: "Validation Error",
      },
      data: {
        target: "body",
        issues: err.errors.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  // 3️⃣ Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      meta: {
        status: 400,
        message: "Mongoose Validation Error",
      },
      data: Object.values(err.errors).map((e) => ({
        path: e.path,
        message: e.message,
      })),
    });
    return;
  }

  // 4️⃣ Duplicate key error (Mongo)
  const mongoErr = err as any;
  if (mongoErr?.code === 11000) {
    const duplicatedField = Object.keys(mongoErr.keyValue || {})[0];
    res.status(409).json({
      meta: {
        status: 409,
        message: `Conflict: ${duplicatedField} already exists`,
      },
      data: mongoErr.keyValue,
    });
    return;
  }

  // 5️⃣ JWT / Token error
  if (
    mongoErr?.name === "JsonWebTokenError" ||
    mongoErr?.name === "TokenExpiredError"
  ) {
    res.status(401).json({
      meta: {
        status: 401,
        message: "Invalid or expired token",
      },
      data: null,
    });
    return;
  }

  // 6️⃣ Default fallback
  res.status(500).json({
    meta: {
      status: 500,
      message: "Internal Server Error",
    },
    data: {
      error: err instanceof Error ? err.message : String(err),
    },
  });
  return;
};
