import { Response } from "express";

interface MetaResponse {
  status: number;
  message: string;
}

interface Pagination {
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export const apiResponse = {
  success(
    res: Response,
    data: any,
    message = "Success",
    statusCode = 200
  ) {
    return res.status(statusCode).json({
      meta: {
        status: statusCode,
        message,
      },
      data,
    });
  },

  created(res: Response, data: any, message = "Resource created") {
    return res.status(201).json({
      meta: {
        status: 201,
        message,
      },
      data,
    });
  },

  paginated(
    res: Response,
    data: any[],
    pagination: Pagination,
    message = "Success"
  ) {
    return res.status(200).json({
      meta: {
        status: 200,
        message,
      },
      data,
      pagination,
    });
  },

  error(
    res: Response,
    message = "Internal Server Error",
    statusCode = 500,
    data: any = null
  ) {
    return res.status(statusCode).json({
      meta: {
        status: statusCode,
        message,
      },
      data,
    });
  },
};
