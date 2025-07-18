import movementController from "#controllers/movement.controller.js";
import { authRequired } from "#middlewares/auth.middleware.js";
import { validateSchema } from "#middlewares/validateSchema.middleware.js";
import movementSchema from "#schemas/movement.schema.js";
import { Router } from "express";

const router = Router();

router.post('/', authRequired, validateSchema(movementSchema.createAndUpdate), movementController.createMovement);

export default router;