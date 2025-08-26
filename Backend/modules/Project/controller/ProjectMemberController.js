import AddProjectMemberDTO from '../dto/AddProjectMemberDTO.js';
import UpdateProjectMemberDTO from '../dto/UpdateProjectMemberDTO.js';
import ActivityLogService from '../../ActivityLog/service/ActivityLogService.js';
import ProjectMemberService from '../service/ProjectMemberService.js';
import ActivityLogConstants from '../../../common/constants/ActivityLogConstants.js';

class ProjectMemberController {

  constructor(){
    this.addUser = this.addUser.bind(this);
    this.listMembers = this.listMembers.bind(this);
    this.updateRole = this.updateRole.bind(this);
    this.remove = this.remove.bind(this);
  }

  async addUser(req, res, next){
    try{
      const dto = new AddProjectMemberDTO({...req.body,addedBy:req.user.userId,projectId:req.params.projectId});
      const member = await ProjectMemberService.addUserToProject(dto);
      ActivityLogService.recordActivity({
            resourceType: ActivityLogConstants.RESOURCE_TYPE.PROJECT,
            resourceId: dto.projectId,
            actionType: ActivityLogConstants.ACTION_TYPE.CREATED,
            description: `User with Id[${dto.userId}] added to the Project`,
            initiatedBy: req.user.userId,
      });
      res.status(201).json({message:'User Added to the Project'});
    } catch(err){
      next(err);
    }
  }

  async listMembers(req, res, next) {
    try {
      const members = await ProjectMemberService.getMembers(req.params.projectId);
      res.status(200).json(members);
    } catch (err) {
      next(err);
    }
  }

  async updateRole(req, res, next) {
    try {
      const dto = new UpdateProjectMemberDTO({...req.body,projectId:req.params.projectId})
      await ProjectMemberService.updateRole(dto);
      ActivityLogService.recordActivity({
            resourceType: ActivityLogConstants.RESOURCE_TYPE.PROJECT,
            resourceId: dto.projectId,
            actionType: ActivityLogConstants.ACTION_TYPE.UPDATED,
            description: `Role updated for User with Id[${dto.userId}]`,
            initiatedBy: req.user.userId,
      });
      res.status(200).json({ message: 'Role updated'});
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      await ProjectMemberService.removeMember(
        req.params.projectId,
        req.params.userId
      );
      ActivityLogService.recordActivity({
            resourceType: ActivityLogConstants.RESOURCE_TYPE.PROJECT,
            resourceId: req.params.projectId,
            actionType: ActivityLogConstants.ACTION_TYPE.DELETED,
            description: `Role updated for User with Id[${dto.userId}]`,
            initiatedBy: req.user.userId,
      });
      res.status(200).json({ message: 'Member removed' });
    } catch (err) {
      next(err);
    }
  }
}

export default new ProjectMemberController();
