import express from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import TaskController from '../controllers/TaskController.js';
import contentTypeMiddleware from '../middleware/ContentTypeMiddleware.js';
import TaskAccessControlMiddleware from '../middleware/TaskAccessControlMiddleware.js';
import ProjectAccessControlMiddleware from '../middleware/ProjectAccessControlMiddleware.js';

const router = express.Router();

router.use(contentTypeMiddleware.allow(['application/json']));

router.post(
  '/',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(['Admin','Manager','Collaborator']),
  TaskController.create
);

router.get(
  '/',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(['Admin','Manager','Collaborator','Viewer']),
  TaskController.list
);

router.get(
  '/:taskId',
  AuthMiddleware.authenticateToken,
  TaskAccessControlMiddleware.checkRole(['Admin','Manager','Collaborator','Viewer']),
  TaskController.fetch
);

router.put(
  '/:taskId',
  AuthMiddleware.authenticateToken,
  TaskAccessControlMiddleware.checkRole(['Admin','Manager','Assigner','Assignee']),
  TaskController.update
);

router.delete(
  '/:taskId',
  AuthMiddleware.authenticateToken,
  TaskAccessControlMiddleware.checkRole(['Admin','Manager','Assigner']),
  TaskController.delete
);

export default router;
