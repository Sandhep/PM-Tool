// /exceptions/BadRequestException.js
export default class BadRequestException extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestException';
    this.statusCode = 400;
  }
}
