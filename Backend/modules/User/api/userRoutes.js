import express from 'express';
import UserController from '../controller/UserController.js';
import AuthMiddleware from '../../../common/middleware/AuthMiddleware.js';
import contentTypeMiddleware from '../../../common/middleware/ContentTypeMiddleware.js';

const router = express.Router();

router.use(contentTypeMiddleware.allow(['application/json']));

router.post(
    '/invite-user',
    AuthMiddleware.authenticateToken,
    UserController.inviteUser
);
router.post('/accept-invite',UserController.acceptInvitation);
router.post('/view-invitations', AuthMiddleware.authenticateToken, UserController.getSentInvitations);
router.delete('/invitation/:invitationId', AuthMiddleware.authenticateToken, UserController.removeInvitation);

export const basePath = '/user';
export default router;