import { Router } from "express";
import userRouter from "#routes/user.route.js";
import movementRouter from "#routes/movement.route.js";
import { authRequired } from "#middlewares/auth.middleware.js";

const router = Router();

router.use('/auth', userRouter);
router.use('/movements', authRequired, movementRouter);

export default router;