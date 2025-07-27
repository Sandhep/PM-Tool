import WorkspaceRepository from '../repositories/WorkspaceRepository.js';
import WorkspaceMemberRepository from '../repositories/WorkspaceMemberRepository.js';
import UserRepository from '../repositories/UserRepository.js';
import NotFoundException from '../exceptions/NotFoundException.js';
import ConflictException from '../exceptions/ConflictException.js';

class WorkspaceService {

  constructor(){
    this.addMember = this.addMember.bind(this);
    this.createWorkspace = this.createWorkspace.bind(this);
    this.deleteWorkspace = this.deleteWorkspace.bind(this);
    this.getMembers = this.getMembers.bind(this);
    this.getMyWorkspaces = this.getMyWorkspaces.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.updateMemberRole = this.updateMemberRole.bind(this);
    this.updateWorkspace = this.updateWorkspace.bind(this);
  }

  async createWorkspace(dto) {

    const { name, description, ownerId } = dto; 

    let workspace = await WorkspaceRepository.findByName(name);

    if(workspace){
      throw new ConflictException('Workspace with same name already exists');
    }

    workspace = await WorkspaceRepository.create({ name, description, ownerId });

    await WorkspaceMemberRepository.addMember({
      workspaceId: workspace.workspaceId,
      userId: ownerId,
      role: 'Admin',
      addedBy: null,
    });

    return workspace;
  }

  async getMyWorkspaces(userId) {
    return WorkspaceRepository.findByOwner(userId);
  }

  async updateWorkspace(dto) {

    const {workspaceId} = dto;

    const workspace = await WorkspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace Not Found');
    }

    return await WorkspaceRepository.update(dto);
  }

  async deleteWorkspace(workspaceId) {

    const workspace = await WorkspaceRepository.findById(workspaceId);

    if (!workspace) {
      throw new NotFoundException('Workspace is already deleted');
    }

    await WorkspaceRepository.delete(workspaceId);
    await WorkspaceMemberRepository.removeAllMembers(workspaceId);
    return true;
  }


  async getMembers(workspaceId) {

    const members = await WorkspaceMemberRepository.findAllByWorkspace(workspaceId);
    const userIds = members.map(m => m.userId);

    const users = await UserRepository.findByUserIds(userIds);
    const userMap = new Map(users.map(u => [u.userId, u]));

    return members.map(m => ({
      userId: m.userId,
      name: userMap.get(m.userId)?.name || '',
      email: userMap.get(m.userId)?.email || '',
      role: m.role,
      addedBy: userMap.get(m.addedBy)?.name || '',
      addedAt: m.addedAt,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }));
  }

  async addMember(dto) {

    const{workspaceId, userId, role, addedBy} = dto;

    let member = await WorkspaceMemberRepository.findByWorkspaceAndUser(workspaceId,userId);
  
    if(member){
        throw new ConflictException("User already exists in the workspace");
    }

    member = WorkspaceMemberRepository.addMember({ workspaceId,userId,role,addedBy});
    return member;

  }

  async updateMemberRole(dto) {

    const {workspaceId, userId, role} = dto;

    const updated = await WorkspaceMemberRepository.updateRole(workspaceId, userId, role);

    if (!updated) {
      throw new NotFoundException('Workspace member not found');
    }

    return updated;
  }

  async removeMember(workspaceId, userId) {
    return WorkspaceMemberRepository.removeMember(workspaceId, userId);
  }
}

export default new WorkspaceService();
