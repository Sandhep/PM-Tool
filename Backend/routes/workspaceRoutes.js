import express from 'express';
import WorkspaceController from '../controllers/WorkspaceController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import contentTypeMiddleware from '../middleware/ContentTypeMiddleware.js';
import WorkspaceAccessControl from '../middleware/WorkspaceAccessControlMiddleware.js';
import WorkspaceConstants from '../constants/WorkspaceConstants.js';

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
  WorkspaceAccessControl.checkRole(WorkspaceConstants.WORKSPACE_ADMIN_ACCESS),
  WorkspaceController.update
);

router.delete(
  '/:workspaceId',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControl.checkRole(WorkspaceConstants.WORKSPACE_ADMIN_ACCESS),
  WorkspaceController.delete
);

// Workspace Member Routes
router.get(
  '/:workspaceId/members',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControl.checkRole(WorkspaceConstants.WORKSPACE_READ_ACCESS),
  WorkspaceController.listMembers
);

router.post(
  '/:workspaceId/members',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControl.checkRole(WorkspaceConstants.WORKSPACE_ADMIN_ACCESS),
  WorkspaceController.addMember
);

router.put(
  '/:workspaceId/members',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControl.checkRole(WorkspaceConstants.WORKSPACE_ADMIN_ACCESS),
  WorkspaceController.updateMemberRole
);

router.delete(
  '/:workspaceId/members/:userId',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControl.checkRole(WorkspaceConstants.WORKSPACE_ADMIN_ACCESS),
  WorkspaceController.removeMember
);

router.post(
  '/view-workspace',
  AuthMiddleware.authenticateToken,
  WorkspaceAccessControl.checkRole(WorkspaceConstants.WORKSPACE_READ_ACCESS),
  WorkspaceController.filterWorkspace
)

export default router;
