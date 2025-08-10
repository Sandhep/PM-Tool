import WorkspaceConstants from '../constants/WorkspaceConstants.js';
import BadRequestException from '../exceptions/BadRequestException.js';

export default class FilterWorkspacesDTO {

  constructor(data) {

    if (data.page < 1) {
      throw new BadRequestException('Page must be 1 or more');
    }

    if (data.limit < 1 || data.limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    if(data.membership && !WorkspaceConstants.WORKSPACE_MEMBERSHIP_FILTER.includes(data.membership)){
      throw new BadRequestException('Invalid Membership');
    }

    this.page = parseInt(data.page) || 1;
    this.limit = parseInt(data.limit) || 10;
    this.membership = data.membership?.trim();
    this.search = data.search?.trim() || '';
  }
}
