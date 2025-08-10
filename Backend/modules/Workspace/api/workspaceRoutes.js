import express from 'express';
import WorkspaceController from '../controller/WorkspaceController.js';
import AuthMiddleware from '../../../common/middleware/AuthMiddleware.js';
import contentTypeMiddleware from '../../../common/middleware/ContentTypeMiddleware.js';
import WorkspaceAccessControl from '../../Workspace/middleware/WorkspaceAccessControlMiddleware.js';
import WorkspaceConstants from '../../../common/constants/WorkspaceConstants.js';

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
  WorkspaceController.filterWorkspace
)

export const basePath = '/workspace';
export default router;
