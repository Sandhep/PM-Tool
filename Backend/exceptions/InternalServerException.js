// /exceptions/InternalServerException.js
export default class InternalServerException extends Error {
  constructor(message = 'Something went wrong') {
    super(message);
    this.name = 'InternalServerException';
    this.statusCode = 500;
  }
}
