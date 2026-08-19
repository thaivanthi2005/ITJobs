import { Router } from "express";
import userRoutes from "./user.route";
import checkRoutes from "./auth.route";
import companyRoute from "./company.route";


const router = Router();

router.use("/user", userRoutes);
router.use("/auth", checkRoutes);
router.use("/company",companyRoute);


export default router;
