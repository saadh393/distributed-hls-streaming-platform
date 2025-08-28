export default class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;

    // Ensure correct prototype chain (important in TS/Node)
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
