export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = "Bad Request") {
    super(message, 400); // HTTP 400: Bad Request
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Not Found") {
    super(message, 404); // HTTP 404: Not Found
  }
}

export class ServerError extends HttpError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500); // HTTP 500: Internal Server Error
  }
}

