import ProjectRepository from '../repositories/ProjectRepository.js';
import ProjectMemberRepository from '../repositories/ProjectMemberRepository.js';
import WorkspaceMemberRepository from '../repositories/WorkspaceMemberRepository.js';
import ForbiddenException from '../exceptions/ForbiddenException.js';
import NotFoundException from '../exceptions/NotFoundException.js';

class AccessControlMiddleware {

  constructor() {
    this.checkProjectAccess = this.checkProjectAccess.bind(this);
    this.checkWorkspaceAccess = this.checkWorkspaceAccess.bind(this);
    this.checkPermission = this.checkPermission.bind(this);
  }

  // Access matrix for each action
  actionPermissions = {
    createProject: ['WorkspaceOwner', 'Admin', 'Member'],
    addRemoveMembers: ['WorkspaceOwner', 'Admin', 'ProjectManager'],
    createEditTask: ['WorkspaceOwner', 'Admin', 'Member', 'ProjectManager', 'Collaborator'],
    assignTask: ['WorkspaceOwner', 'Admin', 'Member', 'ProjectManager', 'Collaborator'],
    deleteProject: ['WorkspaceOwner', 'Admin', 'ProjectManager'],
    viewTaskBoard: ['WorkspaceOwner', 'Admin', 'Member', 'ProjectManager', 'Collaborator', 'Viewer'],
  };

  // Checks workspace membership and stores it in req.workspaceMembership
  async checkWorkspaceAccess(req, res, next) {
    try {
      const { userId } = req.user;
      const workspaceId = req.params.workspaceId || req.body.workspaceId;

      const membership = await WorkspaceMemberRepository.findByWorkspaceAndUser(workspaceId, userId);
      if (!membership) {
        throw new ForbiddenException("You do not belong to this workspace");
      }

      req.workspaceMembership = membership;
      next();
    } catch (err) {
      next(err);
    }
  }

  // Checks project membership or its parent and stores it in req.projectMembership
  async checkProjectAccess(req, res, next) {
    try {
      const { userId } = req.user;
      const projectId = req.params.projectId || req.body.projectId;

      const membership = await this.findProjectMembershipRecursive(projectId, userId);
      if (!membership) {
        throw new ForbiddenException("You do not belong to this project or its Parent Project");
      }

      req.projectMembership = membership;
      next();
    } catch (err) {
      next(err);
    }
  }

  // Recursive search for membership
  async findProjectMembershipRecursive(projectId, userId, visited = new Set()) {
    if (!projectId || visited.has(projectId)) return null;
    visited.add(projectId);

    const membership = await ProjectMemberRepository.findByProjectAndUser(projectId, userId);
    if (membership) return membership;

    const project = await ProjectRepository.findById(projectId);
    if (!project || !project.parentProjectId) return null;

    return this.findProjectMembershipRecursive(project.parentProjectId, userId, visited);
  }

  /**
   * General-purpose permission checker middleware
   * @param {'createProject' | 'addRemoveMembers' | 'createEditTask' | 'assignTask' | 'deleteProject' | 'viewTaskBoard'} action
   * @param {'workspace' | 'project'} resourceType
   */
  checkPermission(action, resourceType = 'project') {
    return (req, res, next) => {
      try {
        const validRoles = this.actionPermissions[action];

        let role = null;
        if (resourceType === 'workspace') {
          role = req.workspaceMembership?.role;
        } else {
          role = req.projectMembership?.role;
        }

        if (!role || !validRoles.includes(role)) {
          throw new ForbiddenException(`Role "${role}" is not allowed to perform action "${action}"`);
        }

        next();
      } catch (err) {
        next(err);
      }
    };
  }

  /**
   * Only project owner
   */
  async checkProjectOwnership(req, res, next) {
    try {
      const { userId } = req.user;
      const projectId = req.params.projectId || req.body.projectId;

      const project = await ProjectRepository.findById(projectId);
      if (!project) throw new NotFoundException("Project not found");

      if (project.ownerId !== userId) {
        throw new ForbiddenException("Only the project owner can perform this action");
      }

      req.project = project;
      next();
    } catch (err) {
      next(err);
    }
  }
}

export default new AccessControlMiddleware();
