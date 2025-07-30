import movementController from "#controllers/movement.controller.js";
import { authorizeAccess } from "#middlewares/auth.middleware.js";
import { validateSchema } from "#middlewares/validateSchema.middleware.js";
import movementSchema from "#schemas/movement.schema.js";
import Movement from "#models/movement.model.js";
import { Router } from "express";

const router = Router();

router.post('/', validateSchema(movementSchema.createAndUpdate), movementController.createMovement);
router.patch('/:id', authorizeAccess({model:Movement}), validateSchema(movementSchema.createAndUpdate), movementController.updateMovement);
router.delete('/:id', authorizeAccess({model:Movement}), movementController.deleteMovement);
router.get('/summary', movementController.getSummary);
router.get('/', movementController.getMovementsByfilters);
router.get('/:id', authorizeAccess({model:Movement}), movementController.getMovement);


export default router;