import movementController from "#controllers/movement.controller.js";
import { authorizeAccess, authorizeRole } from "#middlewares/auth.middleware.js";
import { validateSchema } from "#middlewares/validateSchema.middleware.js";
import movementSchema from "#schemas/movement.schema.js";
import Movement from "#models/movement.model.js";
import { Router } from "express";
import User from "#models/user.model.js";
import Business from "#models/business.model.js";
import { userRoles } from "#config/constants.config.js";

const router = Router();

router.post('/', validateSchema(movementSchema.createAndUpdate), movementController.createMovement);
router.patch('/:id', authorizeAccess({model:Movement}), validateSchema(movementSchema.createAndUpdate), movementController.updateMovement);
router.delete('/:id', authorizeAccess({model:Movement}), movementController.deleteMovement);
router.get('/summary/:userId', authorizeAccess({model:User}) ,movementController.getSummary);
router.get('/last', movementController.getMovementsLastDays);
router.get('/user/:userId', authorizeAccess({model:User}), movementController.getMovementsByfilters);
router.get('/:id', authorizeAccess({model:Movement}), movementController.getMovement);
router.get('/business/:businessId', authorizeRole(userRoles.BUSINESS_OWNER), authorizeAccess({model:Business}, movementController.getMovementsByBusiness));

export default router;