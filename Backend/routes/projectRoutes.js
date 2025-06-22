import express from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import ProjectController from '../controllers/ProjectController.js';
import AccessControlMiddleware from '../middleware/AccessControlMiddleware.js';

const router = express.Router();

router.post(
  '/createProject',
  AuthMiddleware.authenticateToken,
  ProjectController.create
);

router.get(
  '/projectList',
  AuthMiddleware.authenticateToken,
  ProjectController.getMyProjects
);

router.put(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  AccessControlMiddleware.checkAccess,
  AccessControlMiddleware.checkScope('write'),
  ProjectController.updateProject
);

router.delete(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  AccessControlMiddleware.checkProjectOwnership,
  ProjectController.deleteProject
);

export default router;
