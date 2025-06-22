import ProjectService from '../services/ProjectService.js';
import CreateProjectDTO from '../dtos/CreateProjectDTO.js';
import UpdateProjectDTO from '../dtos/UpdateProjectDTO.js';
import DeleteProjectDTO from '../dtos/DeleteProjectDTO.js';

class ProjectController {

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
      const projects = await ProjectService.getMyProjects(req.user.userId);
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
        dto,
        req.user.userId
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
