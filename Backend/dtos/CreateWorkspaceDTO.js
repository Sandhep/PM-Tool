import BadRequestException from '../exceptions/BadRequestException.js';

export default class CreateWorkspaceDTO {

  constructor(data) {
    
    if (!data.name || typeof data.name !== 'string') {
      throw new BadRequestException('Workspace name is required and must be a string');
    }

    if (!data.ownerId || typeof data.ownerId !== 'string') {
      throw new BadRequestException('Owner ID is required');
    }

    this.ownerId = data.ownerId;
    this.name = data.name;
    this.description = data.description || '';
  }
}
