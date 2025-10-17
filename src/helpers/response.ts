import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { format } from "path";
import { z, ZodError } from "zod/v4";

interface MongoErrorWithCode extends Error {
    code?: number;
    errorResponse?: { errmsg: string };
    name: string;
}

type Pagination = {
    totalPages: number;
    current: number;
    total: number;
};

export default {
    success (res: Response, data: any, message: string, statusCode: number = 200) {
        res.status(statusCode).json({
            meta: {
                status: statusCode,
                message,
            },
            data,
        }); 
    },

    error (res: Response, error: unknown, message: string, defaultStatus: number = 500) {
        if (error instanceof ZodError) {
            res.status(defaultStatus).json({
                meta: {
                    status: defaultStatus,
                    message: "Validation Error: Input data is incorrect.",
                },
                data: z.treeifyError(error),
            }); 
        };

        const _err = error as MongoErrorWithCode;
        if (_err.code) {
            const status = (_err.code === 11000) ? 409 : defaultStatus;
            const msg = _err?.errorResponse?.errmsg || _err.message || "Database error";

            return res.status(status).json({
                meta: {
                    status: status,
                    message: (status === 409) ? "Conflict: Resource already exists." : msg,
                },
                data: _err.name || "DatabaseError",
            });
        }
        
        if (error instanceof mongoose.Error) {
             return res.status(500).json({
                meta: {
                    status: 500,
                    message: error.message,
                },
                data: error.name,
            });
        }

        res.status(defaultStatus).json({ 
            meta: {
                status: defaultStatus,
                message: message || "Internal server error",
            },
            data: error, 
        });
    },

    notFound (res: Response, message: string = "Resource Not Found") {
        res.status(404).json({
                meta: {
                    status: 404,
                    message,
                },
                data: null,
            });
    },

    authError (res: Response, message: string, statusCode: 401 | 403 = 401) {
        res.status(statusCode).json({
                meta: {
                    status: statusCode,
                    message,
                },
                data: null,
            });
    },
    
    pagination (res: Response, data: any[], pagination: Pagination, message: string, ) {
        res.status(200).json({
            meta: {
                status: 200,
                message,
            },
            data,
            pagination,
        });
    },
}

