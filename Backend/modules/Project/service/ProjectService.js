import ProjectRepository from '../repository/ProjectRepository.js';
import ProjectMemberRepository from '../repository/ProjectMemberRepository.js';
import ProjectMemberService from '../service/ProjectMemberService.js';

class ProjectService {

   constructor(){
    this.createProject = this.createProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.getChildProjects = this.getChildProjects.bind(this);
    this.getFilteredProjects = this.getFilteredProjects.bind(this);
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

  async getFilteredProjects(filters) {
    return await ProjectRepository.findFilteredProjects(filters);
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
       project:{
          name:projectDetails.name,
          description:projectDetails.description,
          status:projectDetails.status,
          visibility:projectDetails.visibility,
          childProjects
        }  
      }

    return response;

  }
}

export default new ProjectService();
