import { Router } from "express";
import userRouter from "#routes/user.route.js";
import authRouter from "#routes/auth.route.js";
import movementRouter from "#routes/movement.route.js";
import timeSlotRouter from "#routes/timeSlot.route.js";
import bookingRouter from "#routes/booking.route.js";
import businessRouter from "#routes/business.route.js";
import { authorizeRole, authRequired } from "#middlewares/auth.middleware.js";
import { userRoles } from "#config/constants.config.js";

const router = Router();

router.use('/auth', authRouter);
router.use('/users', authRequired, userRouter);
router.use('/movements', authRequired, movementRouter);
router.use('/timeslots', authRequired, timeSlotRouter);
router.use('/bookings', authRequired, bookingRouter);
router.use('/business', authRequired, authorizeRole(userRoles.BUSINESS_OWNER), businessRouter);

export default router;