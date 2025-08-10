import ProjectMemberRepository from '../../Project/repository/ProjectMemberRepository.js';
import ProjectRepository from '../../Project/repository/ProjectRepository.js';
import ForbiddenException from '../../../common/exceptions/ForbiddenException.js';
import NotFoundException from '../../../common/exceptions/NotFoundException.js';
import WorkspaceMemberRepository from '../../Workspace/repository/WorkspaceMemberRepository.js';
import TaskRepositoty from '../../Task/repository/TaskRepository.js';

class TaskAccessControlMiddleware {

  constructor(){
    this.checkRole = this.checkRole.bind(this);
  }

  async getUserRole(userId, taskId) {

    const task = await TaskRepositoty.findById(taskId);
    if(!task) throw new NotFoundException('Task Not Found');
    
    const project = await ProjectRepository.findById(task.projectId);
    if (!project) throw new NotFoundException('Project Not Found');

    const projectMember = await ProjectMemberRepository.findByProjectAndUser(task.projectId,userId);
    if(!projectMember) throw new ForbiddenException(`Access Denied. You're not a part of the Project`);

    const workspaceMember = await WorkspaceMemberRepository.findByWorkspaceAndUser(project.workspaceId,userId);
    if(!workspaceMember) throw new ForbiddenException(`Access Denied. You're not a part of the workspace`);

    if(task.assigneeId.match(userId)){
       return 'Assignee';
    }else if(task.assignerId.match(userId)){
       return 'Assigner';
    }else{
       return projectMember.role;
    } 
  }

  checkRole(requiredRoles = []) {
    return async (req, res, next) => {
      try {
        const { userId } = req.user;
        const taskId = req.params?.taskId || req.body?.taskId || req.query?.taskId;

        const role = await this.getUserRole(userId,taskId);
        
        if(!requiredRoles.includes(role)) {
          throw new ForbiddenException(`Access Denied. Required role(s) for this action: ${requiredRoles.join(', ')}.`);
        }

        next();
      } catch (err) {
        next(err);
      }
    };
  }
}

export default new TaskAccessControlMiddleware();
