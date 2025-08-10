
export default class UnsupportedMediaTypeException extends Error {
  constructor(message = 'Unsupported Media Type') {
    super(message);
    this.name = 'UnsupportedMediaTypeException';
    this.statusCode = 415;
  }
}
