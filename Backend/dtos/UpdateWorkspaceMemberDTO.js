import WorkspaceConstants from '../constants/WorkspaceConstants.js';
import BadRequestException from '../exceptions/BadRequestException.js';

export default class UpdateWorkspaceMemberDTO {

  constructor(data) {
    
    if (!data.userId || typeof data.userId !== 'string') {
      throw new BadRequestException('userId is required and must be string');
    }

    if (!data.workspaceId || typeof data.workspaceId !== 'string') {
      throw new BadRequestException('workspaceId is required');
    }

    if (!data.role || typeof data.role !== 'string' && !WorkspaceConstants.WORKSPACE_READ_ACCESS.includes(data.role)) {
      throw new BadRequestException('Role is invalid');
    }

    this.workspaceId = data.workspaceId;
    this.userId = data.userId;
    this.role = data.role;
  }
}
