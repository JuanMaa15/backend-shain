import authController from '#controllers/auth.controller.js';
import { loginLimiter } from '#middlewares/rateLimiter.middleware.js';
import { Router } from 'express'

const router = Router();

router.post('/login', loginLimiter, authController.login);
router.post('/register', loginLimiter, authController.register);
router.post('/logout', authController.logout);

export default router;