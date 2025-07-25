import { authorizeAccess } from '#middlewares/auth.middleware.js';
import User from '#models/user.model.js';
import { Router } from 'express'
import userController from '#controllers/user.controller.js';
import { validateSchema } from '#middlewares/validateSchema.middleware.js';
import userSchema from '#schemas/user.schema.js';

const router = Router();


router.patch('/:id', authorizeAccess({model:User}), validateSchema(userSchema.updateProfile), userController.updateUser);
router.get('/:id', authorizeAccess({model:User}), userController.getUser);

export default router;