import { authorizeAccess, authorizeRole } from '#middlewares/auth.middleware.js';
import User from '#models/user.model.js';
import { Router } from 'express'
import userController from '#controllers/user.controller.js';
import { validateSchema } from '#middlewares/validateSchema.middleware.js';
import userSchema from '#schemas/user.schema.js';
import { userRoles } from '#config/constants.config.js';

const router = Router();

router.get('/', authorizeRole(userRoles.ADMIN), userController.getUsers);
router.get('/referral-code', authorizeRole(userRoles.ADMIN), userController.getUsersWithReferralCode);
router.get('/referred-code', authorizeRole(userRoles.ADMIN), userController.getUsersByReferredByCode);
router.get('/business', authorizeRole(userRoles.BUSINESS_OWNER), userController.getUsersByBusiness);
router.get('/:id', authorizeAccess({model:User}), userController.getUser);
router.patch('/:id/status', authorizeRole(userRoles.ADMIN), userController.updateUserStatus);
router.patch('/:id/referral-code', authorizeRole(userRoles.ADMIN), validateSchema(userSchema.updateReferralCode), userController.updateReferralCodeUser);
router.patch('/me', authorizeRole(userRoles.SERVICE_PROVIDER, userRoles.BUSINESS_OWNER), validateSchema(userSchema.updateProfile), userController.updateMyprofile);
router.patch('/:id', authorizeRole(userRoles.ADMIN), authorizeAccess({model:User}), validateSchema(userSchema.updateUser), userController.updateUser);



export default router;