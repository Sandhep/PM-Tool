import ProjectRepository from '../repositories/ProjectRepository.js';
import ProjectMemberRepository from '../repositories/ProjectMemberRepository.js';
import ProjectMemberService from './ProjectMemberService.js';
import NotFoundException from '../exceptions/NotFoundException.js';

class ProjectService {

   constructor(){
    this.createProject = this.createProject.bind(this);
    this.getMyProjects = this.getMyProjects.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.getChildProjects = this.getChildProjects.bind(this);
  }

  async createProject(createProjectDTO) {
    
    const { name, description, ownerId, parentProjectId, workspaceId, visibility } = createProjectDTO;

    const project = await ProjectRepository.create({
      name,
      description,
      ownerId,
      workspaceId,
      visibility,
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

  async getMyProjects(userId,workspaceId) {

    const memberships = await ProjectMemberRepository.findProjectsByUser(userId);
    const projectIds = memberships.map(m => m.projectId);

    if (!projectIds.length) return[];

    const projects = await ProjectRepository.findByWorkspace(workspaceId,projectIds);

    if(!projects.length) return[];

    const projectMap = new Map(projects.map(p => [p.projectId, p]));

    const parentProjects = [];

    memberships.forEach(member => {

      const project = projectMap.get(member.projectId);

      if(project){

        parentProjects.push({
          ...project.toObject(),
          isOwner: project.ownerId === userId,
          membership: {
            role: member.role,
            addedBy: member.addedBy,
            joinedAt: member.addedAt
          }
        });

      }

    });

    return  parentProjects; 
  }

  async getChildProjects(userId,parentProjectId){

    const memberships = await ProjectMemberRepository.findProjectsByUser(userId);
    const projectIds = memberships.map(m => m.projectId);

    if (!projectIds.length) return[];

    const projects = await ProjectRepository.findByParentProject(parentProjectId);

    if(!projects.length) return[];

    const projectMap = new Map(projects.map(p => [p.projectId, p]));

    const childProjects = [];

    memberships.forEach(member => {

      const project = projectMap.get(member.projectId);

      if(project){

        childProjects.push({
          ...project.toObject(),
          isOwner: project.ownerId === userId,
          membership: {
            role: member.role,
            addedBy: member.addedBy,
            joinedAt: member.addedAt
          }
        });

      }

    });

    return  childProjects;

  }


  async updateProject(projectId, updates, userId) {

    const membership = await ProjectMemberRepository.findByProjectAndUser(projectId, userId);

    return await ProjectRepository.update(projectId, updates);
  }

  async deleteProject(dto){

    await ProjectRepository.delete(dto.projectId);

    return await ProjectMemberService.removeMember(dto.projectId,dto.userId);
  }

  async getProjectDetails(userId,projectId){

    const projectDetails = await ProjectRepository.findById(projectId);

    const projects = await this.getChildProjects(userId,projectId);
    
    let childProjects = [];

    projects.forEach(project => {
       const node = {
        projectId:project.projectId,
        name:project.name,
        description:project.description,
        visibility:project.visibility
      }
      childProjects.push(node);
    });

    const response = {
       name:projectDetails.name,
       description:projectDetails.description,
       status:projectDetails.status,
       visibility:projectDetails.visibility,
       childProjects
    }

    return response;

  }
}

export default new ProjectService();
