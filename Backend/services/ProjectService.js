import ProjectRepository from '../repositories/ProjectRepository.js';
import ProjectMemberRepository from '../repositories/ProjectMemberRepository.js';
import ProjectMemberService from './ProjectMemberService.js';
import NotFoundException from '../exceptions/NotFoundException.js';
import BadRequestException from '../exceptions/BadRequestException.js';

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

  async getMyProjects(userId, workspaceId, view) {

    if (view === 'my-projects') {

      const memberships = await ProjectMemberRepository.findProjectsByUser(userId);
      if (!memberships.length) return [];

      const projectIds = memberships.map(m => m.projectId);
      const projects = await ProjectRepository.findByWorkspace(workspaceId, projectIds);
      if (!projects.length) return [];

      const projectMap = new Map(projects.map(p => [p.projectId, p]));

      return memberships
        .map(member => projectMap.get(member.projectId))
        .filter(Boolean);

    }else if(view === 'all-projects'){

       return await ProjectRepository.findByWorkspace(workspaceId);

    }else{

      throw new BadRequestException('Invalid query value');

    }

  }


  async getChildProjects(parentProjectId){

    const projects = await ProjectRepository.findByParentProject(parentProjectId);

    if(!projects.length) return[];

    return  projects;

  }


  async updateProject(projectId, updates) {

    return await ProjectRepository.update(projectId, updates);

  }

  async deleteProject(dto){

    await ProjectRepository.delete(dto.projectId);

    return await ProjectMemberService.removeMember(dto.projectId,dto.userId);

  }

  async getProjectDetails(projectId){

    const projectDetails = await ProjectRepository.findById(projectId);

    const projects = await this.getChildProjects(projectId);
    
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
