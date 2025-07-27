import ProjectService from '../services/ProjectService.js';
import CreateProjectDTO from '../dtos/CreateProjectDTO.js';
import UpdateProjectDTO from '../dtos/UpdateProjectDTO.js';
import DeleteProjectDTO from '../dtos/DeleteProjectDTO.js';

class ProjectController {

  constructor(){
    this.create = this.create.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.getMyProjects = this.getMyProjects.bind(this);
    this.updateProject = this.updateProject.bind(this);
  }

  async create(req, res, next) {
    try {
      const dto = new CreateProjectDTO({ ...req.body, ownerId: req.user.userId });
      const project = await ProjectService.createProject(dto);
      res.status(201).json({ message: 'Project created', project });
    } catch (err) {
      next(err);
    }
  }

  async getMyProjects(req, res, next) {
    try {
      const workspaceId = req.query.workspaceId;
      const view = req.query.view;
      const projects = await ProjectService.getMyProjects(req.user.userId,workspaceId,view);
      res.status(200).json({ projects });
    } catch (err) {
      next(err);
    }
  }

  async getProject(req,res,next){
    try{
      const projectId = req.params.projectId;
      const project = await ProjectService.getProjectDetails(req.user.userId,projectId);
      res.status(200).json({project});
    }catch(err){
      next(err);
    }
  }

  async getChildProjects(req, res, next){
    try {
      const parentProjectId = req.params.parentProjectId;
      const projects = await ProjectService.getChildProjects(parentProjectId);
      res.status(200).json({ projects });
    } catch (err) {
      next(err);
    }
  }

  async updateProject(req, res, next) {
    try {
      const dto = new UpdateProjectDTO(req.body);
      const updated = await ProjectService.updateProject(
        req.params.projectId,
        dto
      );
      res.status(200).json({ message: 'Project updated', project: updated });
    } catch (err) {
      next(err);
    }
  }

  async deleteProject(req,res,next){

    try {
      const dto = new DeleteProjectDTO({...req.params,userId: req.user.userId});
      await ProjectService.deleteProject(dto);
      res.status(200).json({ message: 'Project Deleted'});
    } catch (err) {
      next(err);
    }

  }
}

export default new ProjectController();
