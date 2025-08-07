import AddWorkspaceMemberDTO from '../dtos/AddWorkspaceMemberDTO.js';
import CreateWorkspaceDTO from '../dtos/CreateWorkspaceDTO.js';
import FilterWorkspacesDTO from '../dtos/FilterWorkspacesDTO.js';
import UpdateWorkspaceDTO from '../dtos/UpdateWorkspaceDTO.js';
import UpdateWorkspaceMemberDTO from '../dtos/UpdateWorkspaceMemberDTO.js';
import WorkspaceService from '../services/WorkSpaceService.js';

class WorkspaceController {

  constructor(){
     this.create = this.create.bind(this);
     this.addMember = this.addMember.bind(this);
     this.delete = this.delete.bind(this);
     this.list = this.list.bind(this);
     this.listMembers = this.listMembers.bind(this);
     this.removeMember = this.removeMember.bind(this);
     this.update = this.update.bind(this);
     this.updateMemberRole = this.updateMemberRole.bind(this);
     this.filterWorkspace = this.filterWorkspace.bind(this);
  }

  async create(req, res, next) {
    try {
      const dto = new CreateWorkspaceDTO({ ...req.body, ownerId: req.user.userId });
      const workspace = await WorkspaceService.createWorkspace(dto);
      res.status(201).json({ message: 'Workspace created', workspace });
    } catch (err) {
      next(err);
    }
  }

  async list(req, res, next) {
    try {
      const userId = req.user.userId;
      const workspaces = await WorkspaceService.getMyWorkspaces(userId);
      res.status(200).json({ workspaces });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const dto = new UpdateWorkspaceDTO({...req.body,workspaceId:req.params.workspaceId})
      console.log(dto);
      const updated = await WorkspaceService.updateWorkspace(dto);
      res.status(200).json({ message: 'Workspace updated', workspace: updated });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {

    try {
      await WorkspaceService.deleteWorkspace(req.params.workspaceId);
      res.status(200).json({ message: 'Workspace deleted' });
    } catch (err) {
      next(err);
    }
  }

  async listMembers(req, res, next) {
    try {
      const members = await WorkspaceService.getMembers(req.params.workspaceId);
      res.status(200).json({ members });
    } catch (err) {
      next(err);
    }
  }

  async addMember(req, res, next) {
    try {
      const dto = new AddWorkspaceMemberDTO({...req.body,addedBy:req.user.userId,workspaceId:req.params.workspaceId});
      await WorkspaceService.addMember(dto);
      res.status(201).json({ message: 'Member added successfully' });
    } catch (err) {
      next(err);
    }
  }

  async updateMemberRole(req, res, next) {
    try {
      const dto = new UpdateWorkspaceMemberDTO({...req.body,workspaceId:req.params.workspaceId});
      const updated = await WorkspaceService.updateMemberRole(dto);
      res.status(200).json({ message: 'Member role updated', updated });
    } catch (err) {
      next(err);
    }
  }

  async removeMember(req, res, next) {
    try {
      await WorkspaceService.removeMember(req.params.workspaceId, req.params.userId);
      res.status(200).json({ message: 'Member removed successfully' });
    } catch (err) {
      next(err);
    }
  }

  async filterWorkspace(req,res,next){
    try {
      const userId = req.user.userId;
      const dto = new FilterWorkspacesDTO({ ...req.body });
      const result = await WorkspaceService.getFilteredWorkspace(userId, dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

}

export default new WorkspaceController();
