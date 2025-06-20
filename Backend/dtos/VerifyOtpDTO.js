import BadRequestException from '../exceptions/BadRequestException.js';
import Utils from '../utils/Utils.js';

export default class VerifyOtpDTO {
  constructor(data) {

    if (!data.email || !data.otp || !data.password) {
      throw new BadRequestException("Missing required fields");
    }

    if(!Utils.isValidEmail(data.email)){
      throw new BadRequestException("Invalid email format");
    }

    this.email = data.email;
    this.otp = data.otp;
    this.password = data.password;
  }
}
