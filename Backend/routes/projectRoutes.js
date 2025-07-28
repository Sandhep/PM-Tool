import express from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import ProjectController from '../controllers/ProjectController.js';
import ProjectAccessControlMiddleware from '../middleware/ProjectAccessControlMiddleware.js';
import WorkspaceAccessControlMiddleware from '../middleware/WorkspaceAccessControlMiddleware.js';
import contentTypeMiddleware from '../middleware/ContentTypeMiddleware.js';

const router = express.Router();

// Content-Type enforcement
router.use(contentTypeMiddleware.allow(['application/json']));

router.post(
  '/createProject',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControlMiddleware.checkRole(['Admin','Member']),
  ProjectController.create
);

router.get(
  '/projectList',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControlMiddleware.checkRole(['Admin','Member']),
  ProjectController.getMyProjects
);

router.get(
  '/child/:projectId',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(['Admin','Manager','Collaborator','Viewer']),
  ProjectController.getChildProjects
)

router.put(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(['Admin','Manager']),
  ProjectController.updateProject
);

router.delete(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(['Admin']),
  ProjectController.deleteProject
);

router.get(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(['Admin','Manager','Collaborator','Viewer']),
  ProjectController.getProject
)

export default router;
