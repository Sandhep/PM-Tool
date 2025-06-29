
class ConflictException extends Error {
  constructor(message = 'Conflict: Resource already exists') {
    super(message);
    this.name = 'ConflictException';
    this.statusCode = 409;
  }
}

export default ConflictException;