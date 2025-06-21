import ProjectMemberRepository from '../repositories/ProjectMemberRepository.js';
import NotFoundException from '../exceptions/NotFoundException.js';

class ProjectMemberService {
    
  async getMembers(projectId) {
    return ProjectMemberRepository.findAllByProject(projectId);
  }

  async updateScope(projectId, userId, scope) {
    const member = await ProjectMemberRepository.updateScope(projectId, userId, scope);
    if (!member) {
      throw new NotFoundException('Project member not found');
    }
    return member;
  }

  async removeMember(projectId, userId) {
    return ProjectMemberRepository.removeMember(projectId, userId);
  }
}

export default new ProjectMemberService();
