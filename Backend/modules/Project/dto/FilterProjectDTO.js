import BadRequestException from '../../../common/exceptions/BadRequestException.js';
import ProjectConstants from '../../../common/constants/ProjectConstants.js';

export default class FilterProjectDTO {
  constructor(data) {
    if (!data.workspaceId) {
      throw new BadRequestException('Workspace ID is required');
    }

    if (data.page < 1) {
      throw new BadRequestException('Page must be 1 or more');
    }

    if (data.limit < 1 || data.limit > 100) {
      throw new BadRequestException('Limit must be between 1 and 100');
    }

    if (data.status && !ProjectConstants.PROJECT_STATUS.includes(data.status)) {
      throw new BadRequestException('Invalid Project Status');
    }

    if (data.visibility && !ProjectConstants.PROJECT_VISIBILITY.includes(data.visibility)) {
      throw new BadRequestException('Invalid Project Visibility');
    }

    if (data.membership && !ProjectConstants.PROJECT_MEMBERSHIP_FILTER.includes(data.membership)) {
      throw new BadRequestException('Invalid Membership Type');
    }

    this.workspaceId = data.workspaceId.trim();
    this.userId = data.userId?.trim();
    this.membership = data.membership?.trim();
    this.page = parseInt(data.page) || 1;
    this.limit = parseInt(data.limit) || 10;
    this.status = data.status?.trim();
    this.visibility = data.visibility?.trim();
    this.search = data.search?.trim() || '';
  }
}
