import express from 'express';
import UserController from '../controllers/UserController.js';
import AuthMiddleware from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/invite-user',AuthMiddleware.authenticateToken,UserController.inviteUser);
router.post('/accept-invite',UserController.acceptInvitation);

export default router;