// dtos/LoginUserDTO.js
import BadRequestException from "../exceptions/BadRequestException.js";

export default class LoginUserDTO {
  constructor(data) {
    const { email, password } = data;

    if (!email || typeof email !== 'string') {
      throw new BadRequestException("Email is required and must be a string");
    }

    if (!password || typeof password !== 'string') {
      throw new BadRequestException("Password is required and must be a string");
    }

    this.email = email;
    this.password = password;
  }
}
