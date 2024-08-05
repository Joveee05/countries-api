export class NotFoundError extends Error {
  message: string;
  name: string;
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.message = message;
    this.statusCode = 404;
  }
}

export class BadRequestError extends Error {
  message: string;
  name: string;
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.message = message;
    this.statusCode = 400;
  }
}
