import express from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import ProjectMemberController from '../controllers/ProjectMemberController.js';
import AccessControlMiddleware from '../middleware/AccessControlMiddleware.js';
import contentTypeMiddleware from '../middleware/ContentTypeMiddleware.js';

const router = express.Router();

router.use(contentTypeMiddleware.allow(['application/json']));

router.post(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  ProjectMemberController.addUser
);

// View members — anyone with access to project can view
router.get(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkProjectAccess,
 // AccessControlMiddleware.checkPermission('viewTaskBoard'),
  ProjectMemberController.listMembers
);

// Update member role — only roles that can "add/remove members"
router.put(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkProjectAccess,
  //AccessControlMiddleware.checkPermission('addRemoveMembers'),
  ProjectMemberController.updateRole
);

// Remove member — only ProjectManager/Admin/WorkspaceOwner
router.delete(
  '/:projectId/:userId',
  AuthMiddleware.authenticateToken,
  //AccessControlMiddleware.checkProjectAccess,
 // AccessControlMiddleware.checkPermission('addRemoveMembers'),
  ProjectMemberController.remove
);

export default router;
