import express from 'express';
import AuthController from '../controllers/AuthController.js';
import contentTypeMiddleware from '../middleware/ContentTypeMiddleware.js';

const router = express.Router();

router.use(contentTypeMiddleware.allow(['application/json']));

router.post('/login', AuthController.login);
router.post('/register',AuthController.register);
router.post('/request-otp',AuthController.requestOtp);
router.post('/verify-otp',AuthController.resetPasswordWithOtp);

export default router;