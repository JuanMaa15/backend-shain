import { Router } from "express";
import userRouter from "#routes/user.route.js";
import movementRouter from "#routes/movement.route.js";

const router = Router();

router.use('/auth', userRouter);
router.use('/movements', movementRouter);

export default router;