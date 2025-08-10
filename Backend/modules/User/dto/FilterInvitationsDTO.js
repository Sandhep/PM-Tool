import BadRequestException from '../../../common/exceptions/BadRequestException.js';

export default class FilterInvitationsDTO {

  constructor(data) {

    if (data.page < 1) {
      throw new BadRequestException('Page must be 1 or more');
    }

    if (data.limit < 1 || data.limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    this.page = parseInt(data.page) || 1;
    this.limit = parseInt(data.limit) || 10;
    this.role = data.role?.trim();
    this.status = data.status?.trim();
    this.email = data.email?.trim().toLowerCase();
  }
}
