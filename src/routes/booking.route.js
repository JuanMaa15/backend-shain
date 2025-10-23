import bookingController from "#controllers/booking.controller.js";
import { validateSchema } from "#middlewares/validateSchema.middleware.js";
import bookingSchema from "#schemas/booking.schema.js";
import { Router } from "express";

const router = Router();

router.post('/', validateSchema(bookingSchema.create), bookingController.createBooking);
router.get('/', bookingController.getBookingsByFilters);
router.delete('/:id', bookingController.deleteBooking);

export default router;