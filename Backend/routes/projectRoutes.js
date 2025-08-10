import express from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import ProjectController from '../controllers/ProjectController.js';
import ProjectAccessControlMiddleware from '../middleware/ProjectAccessControlMiddleware.js';
import WorkspaceAccessControlMiddleware from '../middleware/WorkspaceAccessControlMiddleware.js';
import contentTypeMiddleware from '../middleware/ContentTypeMiddleware.js';
import ProjectConstants from '../constants/ProjectConstants.js';
import WorkspaceConstants from '../constants/WorkspaceConstants.js';

const router = express.Router();

// Content-Type enforcement
router.use(contentTypeMiddleware.allow(['application/json']));

router.post(
  '/createProject',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControlMiddleware.checkRole(WorkspaceConstants.WORKSPACE_WRITE_ACCESS),
  ProjectController.create
);

router.post(
  '/view-projects',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControlMiddleware.checkRole(WorkspaceConstants.WORKSPACE_READ_ACCESS),
  ProjectController.getMyProjects
);

router.get(
  '/child/:projectId',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(ProjectConstants.PROJECT_READ_ACCESS),
  ProjectController.getChildProjects
)

router.put(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(ProjectConstants.PROJECT_UPDATE_ACCESS),
  ProjectController.updateProject
);

router.delete(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(ProjectConstants.PROJECT_DELETE_ACCESS),
  ProjectController.deleteProject
);

router.get(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(ProjectConstants.PROJECT_READ_ACCESS),
  ProjectController.getProject
)

export default router;
