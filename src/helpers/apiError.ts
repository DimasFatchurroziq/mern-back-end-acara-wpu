export class apiError extends Error {
  public readonly statusCode: number;
  public readonly data?: any;

  constructor(statusCode: number, message: string, data?: any) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }

  static badRequest(message: string, data?: any) {
    return new apiError(400, message, data);
  }

  static unauthorized(message = "Unauthorized") {
    return new apiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new apiError(403, message);
  }

  static notFound(message = "Resource not found") {
    return new apiError(404, message);
  }

  static conflict(message = "Conflict", data?: any) {
    return new apiError(409, message, data);
  }

  static internal(message = "Internal Server Error", data?: any) {
    return new apiError(500, message, data);
  }
}
