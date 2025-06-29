import BadRequestException from '../exceptions/BadRequestException.js';

export default class UpdateWorkspaceDTO {

  constructor(data) {
    
    if (!data.name || typeof data.name !== 'string') {
      throw new BadRequestException('Workspace name is required and must be a string');
    }

    if (!data.workspaceId || typeof data.workspaceId !== 'string') {
      throw new BadRequestException('workspaceId is required');
    }

    this.workspaceId = data.workspaceId;
    this.name = data.name;
    this.description = data.description || '';
  }
}
