import { authorizeAccess, authorizeRole } from '#middlewares/auth.middleware.js';
import User from '#models/user.model.js';
import { Router } from 'express'
import userController from '#controllers/user.controller.js';
import { validateSchema } from '#middlewares/validateSchema.middleware.js';
import userSchema from '#schemas/user.schema.js';
import { userRoles } from '#config/constants.config.js';

const router = Router();

router.get('/', authorizeRole(userRoles.ADMIN), userController.getUsers);
router.get('/:id', authorizeAccess({model:User}), userController.getUser);
router.get('/referral-code', authorizeRole(userRoles.BUSINESS_OWNER), userController.getUsersWithReferralCode);
router.get('/referred-code', authorizeRole(userRoles.BUSINESS_OWNER), userController.getUsersByReferredByCode);
router.patch('/me', authorizeRole(userRoles.BARBER, userRoles.BUSINESS_OWNER), validateSchema(userSchema.updateProfile), userController.updateMyprofile);
router.patch('/:id', authorizeRole(userRoles.ADMIN), authorizeAccess({model:User}), validateSchema(userSchema.updateUser), userController.updateUser);
router.patch('/:id/status', authorizeRole(userRoles.ADMIN), userController.updateUserStatus);


export default router;