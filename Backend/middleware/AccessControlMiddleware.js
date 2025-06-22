import ProjectMemberRepository from '../repositories/ProjectMemberRepository.js';
import ProjectRepository from '../repositories/ProjectRepository.js';
import ForbiddenException from '../exceptions/ForbiddenException.js';
import NotFoundException from '../exceptions/NotFoundException.js';

class AccessControlMiddleware {
    
  async checkAccess(req, res, next) {
    try {
      const { userId } = req.user;
      const { projectId } = req.params;

      const membership = await ProjectMemberRepository.findByProjectAndUser(projectId, userId);
      if (!membership) {
        throw new ForbiddenException("You are not a member of this project");
      }

      // Attach membership details to request for downstream use
      req.projectMembership = membership;

      next();
    } catch (err) {
      next(err);
    }
  }

  checkScope(requiredScope = 'read') {

    return (req, res, next) => {
      try {
        const scope = req.projectMembership?.scope;

        if (scope === 'Full') return next();
        if (requiredScope === 'read') return next();

        throw new ForbiddenException(`Scope "${scope}" is insufficient for ${requiredScope} access`);
      } catch (err) {
        next(err);
      }
    };
  }

  async checkProjectOwnership(req, res, next) {

    try {
      const { userId } = req.user;
      const { projectId } = req.params;

      const project = await ProjectRepository.findById(projectId);
      if (!project) {
        throw new NotFoundException("Project not found");
      }

      if (project.ownerId !== userId) {
        throw new ForbiddenException("Only the project owner can perform this action");
      }

      req.project = project;
      next();
    } catch (error) {
      next(error);
    }
   }

}

export default new AccessControlMiddleware();
