import timeSlotController from "#controllers/timeSlot.controller.js";
import { Router } from "express";

const router = Router();

router.get('/available', timeSlotController.getAvailablesHours);
router.post('/', timeSlotController.createTimeSlot);

export default router;