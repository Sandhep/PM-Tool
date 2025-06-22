import ProjectRepository from '../repositories/ProjectRepository.js';
import ProjectMemberRepository from '../repositories/ProjectMemberRepository.js';
import BadRequestException from '../exceptions/BadRequestException.js';
import ForbiddenException from '../exceptions/ForbiddenException.js';
import ProjectMemberService from './ProjectMemberService.js';

class ProjectService {

  async createProject(createProjectDTO) {
    
    const { name, description, ownerId, parentProjectId } = createProjectDTO;

    const project = await ProjectRepository.create({
      name,
      description,
      ownerId,
      parentProjectId,
    });

    await ProjectMemberRepository.addMember({
      projectId: project.projectId,
      userId: ownerId,
      role: 'Admin',
      scope: 'Full',
      addedBy: null,
    });

    return project;
  }

  async getMyProjects(userId) {

    const memberships = await ProjectMemberRepository.findProjectsByUser(userId);
    const projectIds = memberships.map(m => m.projectId);
    if (!projectIds.length) return [];

    const projects = await ProjectRepository.findByIds(projectIds);
    const projectMap = new Map(projects.map(p => [p.projectId, p]));

    return memberships.map(member => {
      const project = projectMap.get(member.projectId);
      return {
          ...project.toObject(),
          isOwner: project.ownerId === userId,
          membership: {
            role: member.role,
            scope: member.scope,
            addedBy: member.addedBy,
            joinedAt: member.addedAt
          }
        };
      });
  }


  async updateProject(projectId, updates, userId) {

    const membership = await ProjectMemberRepository.findByProjectAndUser(projectId, userId);

    if (!membership || membership.scope !== 'Full') {
      throw new ForbiddenException('Insufficient permissions to update project');
    }

    return ProjectRepository.update(projectId, updates);
  }

  async deleteProject(dto){

    await ProjectRepository.delete(dto.projectId);

    await ProjectMemberService.removeMember(dto.projectId,dto.userId);
  }
}

export default new ProjectService();
