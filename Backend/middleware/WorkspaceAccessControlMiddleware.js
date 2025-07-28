import WorkspaceMemberRepository from '../repositories/WorkspaceMemberRepository.js';
import WorkspaceRepository from '../repositories/WorkspaceRepository.js';
import ForbiddenException from '../exceptions/ForbiddenException.js';
import NotFoundException from '../exceptions/NotFoundException.js';

class WorkspaceAccessControlMiddleware {

  constructor(){
    this.checkRole = this.checkRole.bind(this);
  }

  async getUserRole(userId, workspaceId) {
    const workspace = await WorkspaceRepository.findById(workspaceId);
    if (!workspace) throw new NotFoundException('Workspace Not Found');

    const membership = await WorkspaceMemberRepository.findByWorkspaceAndUser(workspaceId, userId);
    return membership ? membership.role : null;
  }

  checkRole(requiredRoles = []) {
    return async (req, res, next) => {
      try {
        const { userId } = req.user;
        const workspaceId = req.params?.workspaceId || req.body?.workspaceId || req.query?.workspaceId;

        const role = await this.getUserRole(userId, workspaceId);
        if (!role || !requiredRoles.includes(role)) {
          throw new ForbiddenException(`Access Denied. Required roles for this action: ${requiredRoles.join(', ')}`);
        }

        next();
      } catch (err) {
        next(err);
      }
    };
  }
}

export default new WorkspaceAccessControlMiddleware();
