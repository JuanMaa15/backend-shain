import authController from '#controllers/auth.controller.js';
import { loginLimiter } from '#middlewares/rateLimiter.middleware.js';
import { validateSchema } from '#middlewares/validateSchema.middleware.js';
import userSchema from '#schemas/user.schema.js';
import { Router } from 'express'

const router = Router();

router.post('/login', loginLimiter, validateSchema(userSchema.login), authController.login);
router.post('/register', loginLimiter, validateSchema(userSchema.register), authController.register);
router.post('/logout', authController.logout);

export default router;