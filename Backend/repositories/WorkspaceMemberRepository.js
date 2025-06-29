import WorkspaceMember from '../models/WorkspaceMember.js';

class WorkspaceMemberRepository {
  async addMember(data) {
    return WorkspaceMember.create(data);
  }

  async findByWorkspaceAndUser(workspaceId, userId) {
    return WorkspaceMember.findOne({ workspaceId, userId });
  }

  async findByWorkspaceAndEmail(workspaceId, emailId) {
    return WorkspaceMember.findOne({ workspaceId, emailId });
  }

  async findAllByWorkspace(workspaceId) {
    return WorkspaceMember.find({ workspaceId });
  }

  async removeMember(workspaceId, userId) {
    return WorkspaceMember.deleteOne({ workspaceId, userId });
  }

  async removeAllMembers(workspaceId){
    return WorkspaceMember.deleteMany({workspaceId});
  }

  async updateRole(workspaceId, userId, role) {
    return WorkspaceMember.findOneAndUpdate({ workspaceId, userId }, { role }, { runValidators:true });
  }
}

export default new WorkspaceMemberRepository();
