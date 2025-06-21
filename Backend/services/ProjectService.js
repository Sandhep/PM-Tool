import ProjectRepository from '../repositories/ProjectRepository.js';
import ProjectMemberRepository from '../repositories/ProjectMemberRepository.js';
import BadRequestException from '../exceptions/BadRequestException.js';

class ProjectService {
  async createProject({ name, description, createdBy }) {
    const project = await ProjectRepository.create({ name, description, createdBy });

    await ProjectMemberRepository.addMember({
      projectId: project.projectId,
      userId: createdBy,
      role: 'Owner',
      scope: 'Full',
      addedBy: createdBy
    });

    return project;
  }

  async getMyProjects(userId) {
    const memberships = await ProjectMemberRepository.findProjectsByUser(userId);
    const projectIds = memberships.map(m => m.projectId);
    return Promise.all(projectIds.map(id => ProjectRepository.findById(id)));
  }

  async updateProject(projectId, updates, userId) {
    const membership = await ProjectMemberRepository.findByProjectAndUser(projectId, userId);
    if (!membership || membership.scope !== 'Full') {
      throw new BadRequestException('Insufficient permissions to update project');
    }

    return ProjectRepository.update(projectId, updates);
  }
}

export default new ProjectService();
