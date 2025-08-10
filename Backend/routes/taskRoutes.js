import express from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import TaskController from '../controllers/TaskController.js';
import contentTypeMiddleware from '../middleware/ContentTypeMiddleware.js';
import TaskAccessControlMiddleware from '../middleware/TaskAccessControlMiddleware.js';
import ProjectAccessControlMiddleware from '../middleware/ProjectAccessControlMiddleware.js';
import TaskConstants from '../constants/TaskConstants.js';

const router = express.Router();

router.use(contentTypeMiddleware.allow(['application/json']));

router.post(
  '/',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(TaskConstants.TASK_CREATE_ACCESS),
  TaskController.create
);

router.get(
  '/', 
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(TaskConstants.TASK_READ_ACCESS),
  TaskController.list
);

router.post(
  '/view-tasks',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(TaskConstants.TASK_READ_ACCESS),
  TaskController.viewTasks
)

router.get(
  '/:taskId',
  AuthMiddleware.authenticateToken,
  TaskAccessControlMiddleware.checkRole(TaskConstants.TASK_READ_ACCESS),
  TaskController.fetch
);

router.put(
  '/:taskId',
  AuthMiddleware.authenticateToken,
  TaskAccessControlMiddleware.checkRole(TaskConstants.TASK_UPDATE_ACCESS),
  TaskController.update
);

router.delete(
  '/:taskId',
  AuthMiddleware.authenticateToken,
  TaskAccessControlMiddleware.checkRole(TaskConstants.TASK_DELETE_ACCESS),
  TaskController.delete
);

export default router;
