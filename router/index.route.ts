import { Router } from "express";
import userRoutes from "./user.route";
import checkRoutes from "./auth.route";
import companyRoute from "./company.route";
import cityRoutes from "./city.route";
import searchRoutes from "./search.route"
import jobRoutes from "./job.route";
const router = Router();

router.use("/user", userRoutes);
router.use("/auth", checkRoutes);
router.use("/company",companyRoute);
router.use('/city', cityRoutes);
router.use('/search', searchRoutes);
router.use('/job', jobRoutes);


export default router;
