import { Router } from "express";
import userRouter from "#routes/user.route.js";
import authRouter from "#routes/auth.route.js";
import movementRouter from "#routes/movement.route.js";
import { authRequired } from "#middlewares/auth.middleware.js";

const router = Router();

router.use('/auth', authRouter);
router.use('/users', authRequired, userRouter);
router.use('/movements', authRequired, movementRouter);

export default router;