import BadRequestException from '../exceptions/BadRequestException.js';

export default class AddProjectMemberDTO {

  constructor(data) {
    
    if (!data.userId || typeof data.userId !== 'string') {
      throw new BadRequestException('userId is required and must be string');
    }

    if (!data.projectId || typeof data.projectId !== 'string') {
      throw new BadRequestException('workspaceId is required');
    }

    this.projectId = data.projectId;
    this.userId = data.userId;
    this.role = data.role || '';
    this.addedBy = data.addedBy;
  }
}