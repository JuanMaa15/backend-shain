import { userRoles } from "#config/constants.config.js";
import timeSlotController from "#controllers/timeSlot.controller.js";
import { authorizeRole } from "#middlewares/auth.middleware.js";
import { validateSchema } from "#middlewares/validateSchema.middleware.js";
import timeSlotSchema from "#schemas/timeSlot.schema.js";
import { Router } from "express";

const router = Router();

router.get('/available', authorizeRole(userRoles.SERVICE_PROVIDER, userRoles.BUSINESS_OWNER), timeSlotController.getAvailablesHours);
router.post('/', authorizeRole(userRoles.ADMIN), validateSchema(timeSlotSchema.create), timeSlotController.createTimeSlot);
router.patch('/:id', authorizeRole(userRoles.ADMIN), validateSchema(timeSlotSchema.createUpdate), timeSlotController.updateTimeSlot);

export default router;