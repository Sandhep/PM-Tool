import express from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware.js';
import ProjectMemberController from '../controllers/ProjectMemberController.js';
import ProjectAccessControlMiddleware from '../middleware/ProjectAccessControlMiddleware.js';
import contentTypeMiddleware from '../middleware/ContentTypeMiddleware.js';

const router = express.Router();

// Content-Type enforcement
router.use(contentTypeMiddleware.allow(['application/json']));

router.post(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(['Admin','Manager']),
  ProjectMemberController.addUser
);


router.get(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(['Admin','Manager','Collaborator','Viewer']),
  ProjectMemberController.listMembers
);


router.put(
  '/:projectId',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(['Admin','Manager']),
  ProjectMemberController.updateRole
);


router.delete(
  '/:projectId/:userId',
  AuthMiddleware.authenticateToken,
  ProjectAccessControlMiddleware.checkRole(['Admin','Manager']),
  ProjectMemberController.remove
);

export default router;
