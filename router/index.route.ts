import { Router } from "express";
import userRoutes from "./user.route";
import checkRoutes from "./auth.route";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", checkRoutes);

export default router;
