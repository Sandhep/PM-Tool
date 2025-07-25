import ProjectMember from '../models/ProjectMember.js';

class ProjectMemberRepository {
  async addMember(memberData) {
    return new ProjectMember(memberData).save();
  }

  async findByProjectAndUser(projectId, userId) {
    return ProjectMember.findOne({ projectId, userId });
  }

  async findByProjectAndEmail(projectId, emailId) {
    return ProjectMember.findOne({ projectId, emailId });
  }

  async findAllByProject(projectId) {
    return ProjectMember.find({ projectId });
  }

  async findProjectsByUser(userId) {
    return ProjectMember.find({ userId });
  }

  async updateRole(projectId, userId, role) {
    return ProjectMember.findOneAndUpdate(
      { projectId, userId },
      { role },
      { new: true }
    );
  }

  async removeMember(projectId, userId) {
    return ProjectMember.findOneAndDelete({ projectId, userId });
  }
}

export default new ProjectMemberRepository();
