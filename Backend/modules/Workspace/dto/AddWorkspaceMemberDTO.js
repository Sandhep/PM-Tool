import BadRequestException from '../../../common/exceptions/BadRequestException.js';

export default class AddWorkspaceMemberDTO {

  constructor(data) {
    
    if (!data.userId || typeof data.userId !== 'string') {
      throw new BadRequestException('userId is required and must be string');
    }

    if (!data.workspaceId || typeof data.workspaceId !== 'string') {
      throw new BadRequestException('workspaceId is required');
    }

    this.workspaceId = data.workspaceId;
    this.userId = data.userId;
    this.role = data.role || '';
    this.addedby = data.addedby;
  }
}
