import BadRequestException from '../../../common/exceptions/BadRequestException.js';

export default class CreateProjectDTO {

  constructor(data) {
    
    if (!data.name || typeof data.name !== 'string') {
      throw new BadRequestException('Project name is required and must be a string');
    }

    if (!data.ownerId || typeof data.ownerId !== 'string') {
      throw new BadRequestException('Owner ID is required');
    }

    this.ownerId = data.ownerId;
    this.parentProjectId = data.parentProjectId || null;
    this.workspaceId = data.workspaceId || null;
    this.visibility = data.visibility || 'Private';
    this.name = data.name;
    this.description = data.description || '';
  }
}
