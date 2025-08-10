import BadRequestException from '../../../common/exceptions/BadRequestException.js';
import Utils from '../../../common/utils/Utils.js';

export default class RequestOtpDTO {

  constructor(data) {

    if (!data.email || typeof data.email !== 'string') {
          throw new BadRequestException("Email is required and must be a string");
    }

    if (!Utils.isValidEmail(data.email)) {
      throw new BadRequestException("Invalid email format");
    }

    this.email = data.email;
  }
}
