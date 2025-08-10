import ProjectMemberRepository from '../repository/ProjectMemberRepository.js';
import ProjectRepository from '../repository/ProjectRepository.js';
import ForbiddenException from '../../../common/exceptions/ForbiddenException.js';
import NotFoundException from '../../../common/exceptions/NotFoundException.js';
import WorkspaceMemberRepository from '../../Workspace/repository/WorkspaceMemberRepository.js';

class ProjectAccessControlMiddleware {

  constructor(){
    this.checkRole = this.checkRole.bind(this);
  }

  async getUserRole(userId, projectId) {
    const project = await ProjectRepository.findById(projectId);
    if (!project) throw new NotFoundException('Project Not Found');

    const workspaceMember = await WorkspaceMemberRepository.findByWorkspaceAndUser(project.workspaceId,userId);
    if(!workspaceMember) throw new ForbiddenException(`Access Denied. You're not a part of the workspace`);

    const membership = await ProjectMemberRepository.findByProjectAndUser(projectId, userId);

    if(!membership && project.visibility.match('Workspace')){
        return 'Viewer';  
    }    

    return membership ? membership.role : null;
  }

  checkRole(requiredRoles = []) {
    return async (req, res, next) => {
      try {
        const { userId } = req.user;
        const projectId = req.params?.projectId || req.body?.projectId || req.query?.projectId;

        const role = await this.getUserRole(userId, projectId);
        if (!role){
          throw new ForbiddenException(`Access Denied. You're are not a part of the Project`);
        }else if(!requiredRoles.includes(role)) {
          throw new ForbiddenException(`Access Denied. Required role(s) for this action: ${requiredRoles.join(', ')}.`);
        }

        next();
      } catch (err) {
        next(err);
      }
    };
  }
}

export default new ProjectAccessControlMiddleware();
