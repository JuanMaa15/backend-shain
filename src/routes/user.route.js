import { authorizeAccess } from '#middlewares/auth.middleware.js';
import User from '#models/user.model.js';
import { Router } from 'express'
import userController from '#controllers/user.controller.js';
import { validateSchema } from '#middlewares/validateSchema.middleware.js';
import userSchema from '#schemas/user.schema.js';

const router = Router();

router.get('/', userController.getUsers);
router.get('/:id', authorizeAccess({model:User}), userController.getUser);
router.patch('/me', validateSchema(userSchema.updateProfile), userController.updateMyprofile);
router.patch('/:id', authorizeAccess({model:User}), validateSchema(userSchema.updateUser), userController.updateUser);
router.patch('/:id/status', authorizeAccess({model: User}), userController.updateUserStatus);


export default router;