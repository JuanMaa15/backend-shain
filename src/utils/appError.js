export class AppError extends Error {

  constructor(status, message, statusCode = 500) {
    super(message);
    this.status = status;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

}