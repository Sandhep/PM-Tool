import express from 'express';
import WorkspaceController from '../controllers/WorkspaceController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import contentTypeMiddleware from '../middleware/ContentTypeMiddleware.js';
import WorkspaceAccessControlMiddleware from '../middleware/WorkspaceAccessControlMiddleware.js';

const router = express.Router();

router.use(contentTypeMiddleware.allow(['application/json']));

// Workspace CRUD
router.post(
  '/create',
  AuthMiddleware.authenticateToken,
  WorkspaceController.create
);

router.get(
  '/',
  AuthMiddleware.authenticateToken,
  WorkspaceController.list
);

router.put(
  '/:workspaceId',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControlMiddleware.checkAdminAccess,
  WorkspaceController.update
);

router.delete(
  '/:workspaceId',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControlMiddleware.checkAdminAccess,
  WorkspaceController.delete
);

// Workspace Member Routes
router.get(
  '/:workspaceId/members',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControlMiddleware.checkMemberAccess,
  WorkspaceController.listMembers
);

router.post(
  '/:workspaceId/members',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControlMiddleware.checkAdminAccess,
  WorkspaceController.addMember
);

router.put(
  '/:workspaceId/members',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControlMiddleware.checkAdminAccess,
  WorkspaceController.updateMemberRole
);

router.delete(
  '/:workspaceId/members/:userId',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControlMiddleware.checkAdminAccess,
  WorkspaceController.removeMember
);

export default router;
