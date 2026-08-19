import { Router } from "express";
import * as companyValidate from "../validates/company.validate"
import * as companyController from "../controller/company.controller";

const router = Router();

router.post(
  "/register",
//   companyValidate.registerPost,
  companyController.registerPost,
);
// router.post("/login", companyValidate.loginPost, userController.loginPost);
export default router;
