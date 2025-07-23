import { authorizeAccess } from '#middlewares/auth.middleware.js';
import User from '#models/user.model.js';
import { Router } from 'express'
import userController from '#controllers/user.controller.js';

const router = Router();


router.patch('/:id', authorizeAccess({model:User}), userController.updateUser);
router.get('/:id', authorizeAccess({model:User}), userController.getUser);

export default router;