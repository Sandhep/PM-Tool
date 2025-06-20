import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register',AuthController.register);
router.post('/request-otp',AuthController.requestOtp);
router.post('/verify-otp',AuthController.resetPasswordWithOtp);

export default router;