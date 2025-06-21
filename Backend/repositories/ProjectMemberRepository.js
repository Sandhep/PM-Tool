import ProjectMember from '../models/ProjectMember.js';

class ProjectMemberRepository {
  async addMember(memberData) {
    return new ProjectMember(memberData).save();
  }

  async findByProjectAndUser(projectId, userId) {
    return ProjectMember.findOne({ projectId, userId });
  }

  async findAllByProject(projectId) {
    return ProjectMember.find({ projectId });
  }

  async findProjectsByUser(userId) {
    return ProjectMember.find({ userId });
  }

  async updateScope(projectId, userId, scope) {
    return ProjectMember.findOneAndUpdate(
      { projectId, userId },
      { scope },
      { new: true }
    );
  }

  async removeMember(projectId, userId) {
    return ProjectMember.findOneAndDelete({ projectId, userId });
  }
}

export default new ProjectMemberRepository();
