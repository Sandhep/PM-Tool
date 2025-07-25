import express from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import ProjectController from '../controllers/ProjectController.js';
import AccessControlMiddleware from '../middleware/AccessControlMiddleware.js';

const router = express.Router();

// Create project - requires workspace-level access
router.post(
  '/createProject',
  AuthMiddleware.authenticateToken,
 // AccessControlMiddleware.checkWorkspaceAccess,
 // AccessControlMiddleware.checkPermission('createProject', 'workspace'),
  ProjectController.create
);

// Get all user projects
router.get(
  '/projectList',
  AuthMiddleware.authenticateToken,
  ProjectController.getMyProjects
);

router.get(
  '/child/:parentProjectId',
  AuthMiddleware.authenticateToken,
  ProjectController.getChildProjects
)

// Update project - requires project-level write permission
router.put(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkProjectAccess,
  //AccessControlMiddleware.checkPermission('createEditTask'), // OR another action based on context
  ProjectController.updateProject
);

// Delete project - only if role is allowed (Workspace Owner / Admin / Project Manager)
router.delete(
  '/:projectId',
  AuthMiddleware.authenticateToken,
 // AccessControlMiddleware.checkProjectAccess,
 // AccessControlMiddleware.checkPermission('deleteProject'),
  ProjectController.deleteProject
);

router.get(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  ProjectController.getProject
)

export default router;
