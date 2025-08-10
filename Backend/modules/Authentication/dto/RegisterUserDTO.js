// dtos/RegisterUserDTO.js
import BadRequestException from "../../../common/exceptions/BadRequestException.js";
import Utils from "../../../common/utils/Utils.js";

export default class RegisterUserDTO {
  constructor(data) {
    const { name, email, password } = data;

    if (!name || typeof name !== 'string') {
      throw new BadRequestException("Name is required and must be a string");
    }

    if (!email || typeof email !== 'string') {
      throw new BadRequestException("Email is required and must be a string");
    }

    if(!Utils.isValidEmail(email)){
      throw new BadRequestException("Invalid email format");
    }

    if (!password || typeof password !== 'string') {
      throw new BadRequestException("Password is required and must be a string");
    }

    this.name = name;
    this.email = email;
    this.password = password;
  }
}
