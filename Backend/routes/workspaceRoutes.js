import express from 'express';
import WorkspaceController from '../controllers/WorkspaceController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import contentTypeMiddleware from '../middleware/ContentTypeMiddleware.js';
import WorkspaceAccessControl from '../middleware/WorkspaceAccessControlMiddleware.js';

const router = express.Router();

// Content-Type enforcement
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
  WorkspaceAccessControl.checkRole(['Admin']),
  WorkspaceController.update
);

router.delete(
  '/:workspaceId',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControl.checkRole(['Admin']),
  WorkspaceController.delete
);

// Workspace Member Routes
router.get(
  '/:workspaceId/members',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControl.checkRole(['Admin', 'Member']),
  WorkspaceController.listMembers
);

router.post(
  '/:workspaceId/members',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControl.checkRole(['Admin']),
  WorkspaceController.addMember
);

router.put(
  '/:workspaceId/members',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControl.checkRole(['Admin']),
  WorkspaceController.updateMemberRole
);

router.delete(
  '/:workspaceId/members/:userId',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControl.checkRole(['Admin']),
  WorkspaceController.removeMember
);

export default router;
