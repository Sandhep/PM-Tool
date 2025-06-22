import express from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import ProjectMemberController from '../controllers/ProjectMemberController.js';
import AccessControlMiddleware from '../middleware/AccessControlMiddleware.js';

const router = express.Router();

router.get(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  AccessControlMiddleware.checkAccess,
  AccessControlMiddleware.checkScope('read'),
  ProjectMemberController.listMembers
);

router.put(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  AccessControlMiddleware.checkAccess,
  AccessControlMiddleware.checkScope('write'),
  ProjectMemberController.updateScope
);

router.delete(
  '/:projectId/:userId',
  AuthMiddleware.authenticateToken,
  AccessControlMiddleware.checkAccess,
  AccessControlMiddleware.checkScope('write'),
  ProjectMemberController.remove
);

export default router;
