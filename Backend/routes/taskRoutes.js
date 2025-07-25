// routes/taskRoutes.js
import express from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import TaskController from '../controllers/TaskController.js';
//import AccessControlMiddleware from '../middleware/AccessControlMiddleware.js';

const router = express.Router();

router.post(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkAccess,
  //AccessControlMiddleware.checkScope('edit'),
  TaskController.create
);

router.get(
  '/:projectId',
  //AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkAccess,
  TaskController.list
);

router.put(
  '/:projectId/:taskId',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkAccess,
  //AccessControlMiddleware.checkScope('edit'),
  TaskController.update
);

router.delete(
  '/:projectId/:taskId',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkAccess,
  //AccessControlMiddleware.checkScope('full'),
  TaskController.delete
);

export default router;
