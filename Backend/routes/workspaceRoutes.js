import express from 'express';
import WorkspaceController from '../controllers/WorkspaceController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import AccessControlMiddleware from '../middleware/AccessControlMiddleware.js';

const router = express.Router();

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
  //AccessControlMiddleware.checkWorkspaceAccess,
  //AccessControlMiddleware.checkPermission('createProject', 'workspace'), // or custom permission
  WorkspaceController.update
);

router.delete(
  '/:workspaceId',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkWorkspaceAccess,
 // AccessControlMiddleware.checkPermission('deleteProject', 'workspace'),
  WorkspaceController.delete
);

// Workspace Member Routes
router.get(
  '/:workspaceId/members',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkWorkspaceAccess,
  WorkspaceController.listMembers
);

router.post(
  '/:workspaceId/members',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkWorkspaceAccess,
 // AccessControlMiddleware.checkPermission('addRemoveMembers', 'workspace'),
  WorkspaceController.addMember
);

router.put(
  '/:workspaceId/members',
  AuthMiddleware.authenticateToken,
 // AccessControlMiddleware.checkWorkspaceAccess,
  //AccessControlMiddleware.checkPermission('addRemoveMembers', 'workspace'),
  WorkspaceController.updateMemberRole
);

router.delete(
  '/:workspaceId/members/:userId',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkWorkspaceAccess,
 // AccessControlMiddleware.checkPermission('addRemoveMembers', 'workspace'),
  WorkspaceController.removeMember
);

export default router;
