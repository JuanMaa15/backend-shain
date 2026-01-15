import authController from '#controllers/auth.controller.js';
import { authRequired } from '#middlewares/auth.middleware.js';
import { loginLimiter } from '#middlewares/rateLimiter.middleware.js';
import { validateSchema } from '#middlewares/validateSchema.middleware.js';
import authSchema from '#schemas/auth.schema.js';

import { Router } from 'express'

const router = Router();

router.post('/login', loginLimiter, validateSchema(authSchema.login), authController.login);
router.post('/register', loginLimiter, validateSchema(authSchema.register), authController.register);
router.post('/logout', authController.logout);
router.post('/forgot-password', validateSchema(authSchema.requestPassword), authController.requestPasswordChange);
router.post('/reset-password', validateSchema(authSchema.resetPassword), authController.resetPassword);
router.patch('/me/password', authRequired, validateSchema(authSchema.changePassword), authController.updatePassword)

export default router;