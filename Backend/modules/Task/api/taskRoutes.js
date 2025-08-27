import express from 'express';
import AuthMiddleware from '../../../common/middleware/AuthMiddleware.js';
import TaskController from '../controller/TaskController.js';
import contentTypeMiddleware from '../../../common/middleware/ContentTypeMiddleware.js';
import TaskAccessControlMiddleware from '../middleware/TaskAccessControlMiddleware.js';
import ProjectAccessControlMiddleware from '../../Project/middleware/ProjectAccessControlMiddleware.js';
import TaskConstants from '../../../common/constants/TaskConstants.js';

const router = express.Router();

router.use(contentTypeMiddleware.allow(['application/json']));

router.post(
  '/',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(TaskConstants.TASK_CREATE_ACCESS),
  TaskController.create
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

router.put(
  '/:taskId/assignee',
  AuthMiddleware.authenticateToken,
  TaskAccessControlMiddleware.checkRole(TaskConstants.TASK_ASSIGNER_ACCESS),
  TaskController.updateTaskAssignee
)

router.delete(
  '/:taskId',
  AuthMiddleware.authenticateToken,
  TaskAccessControlMiddleware.checkRole(TaskConstants.TASK_DELETE_ACCESS),
  TaskController.delete
);

export const basePath = '/task';
export default router;
