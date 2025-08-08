import ProjectConstants from '../constants/ProjectConstants.js';
import BadRequestException from '../exceptions/BadRequestException.js';

export default class UpdateProjectMemberDTO {

  constructor(data) {
    
    if (!data.userId || typeof data.userId !== 'string') {
      throw new BadRequestException('userId is required and must be string');
    }

    if (!data.projectId || typeof data.projectId !== 'string') {
      throw new BadRequestException('projectId is required');
    }

    if (!data.role || typeof data.role !== 'string' && !ProjectConstants.PROJECT_READ_ACCESS.includes(data.role)) {
      throw new BadRequestException('Role is invalid');
    }

    this.projectId = data.projectId;
    this.userId = data.userId;
    this.role = data.role;
  }
}
