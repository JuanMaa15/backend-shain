import authController from '#controllers/auth.controller.js';
import { loginLimiter } from '#middlewares/rateLimiter.middleware.js';
import { Router } from 'express'

const router = Router();

router.get('/login', loginLimiter, authController.login);

export default router;