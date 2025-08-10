import BadRequestException from "../../../common/exceptions/BadRequestException.js";
import Utils from "../../../common/utils/Utils.js";

export default class LoginUserDTO {
  constructor(data) {
    const { email, password } = data;

    if (!email || typeof email !== 'string') {
      throw new BadRequestException("Email is required and must be a string");
    }

    if(!Utils.isValidEmail(email)){
      throw new BadRequestException("Invalid email format");
    }

    if (!password || typeof password !== 'string') {
      throw new BadRequestException("Password is required and must be a string");
    }

    this.email = email;
    this.password = password;
  }
}
