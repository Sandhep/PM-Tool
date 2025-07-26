import express from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import TaskController from '../controllers/TaskController.js';
import contentTypeMiddleware from '../middleware/ContentTypeMiddleware.js';
//import AccessControlMiddleware from '../middleware/AccessControlMiddleware.js';

const router = express.Router();

router.use(contentTypeMiddleware.allow(['application/json']));

router.post(
  '/',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkAccess,
  //AccessControlMiddleware.checkScope('edit'),
  TaskController.create
);

router.get(
  '/',
  //AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkAccess,
  AuthMiddleware.authenticateToken,
  TaskController.list
);

router.get(
  '/:taskId',
  AuthMiddleware.authenticateToken,
  TaskController.fetch
);

router.put(
  '/:taskId',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkAccess,
  //AccessControlMiddleware.checkScope('edit'),
  TaskController.update
);

router.delete(
  '/:taskId',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkAccess,
  //AccessControlMiddleware.checkScope('full'),
  TaskController.delete
);

export default router;
