import express from 'express';
import UserController from '../controllers/UserController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/invite-user',AuthMiddleware.authenticateToken,UserController.inviteUser);
router.post('/accept-invite',UserController.acceptInvitation);
router.post('/sent-invitations', AuthMiddleware.authenticateToken, UserController.getSentInvitations);
router.delete('/invitation/:invitationId', AuthMiddleware.authenticateToken, UserController.removeInvitation);


export default router;