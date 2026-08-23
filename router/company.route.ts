import { Router } from "express";
import * as companyValidate from "../validates/company.validate"
import * as companyController from "../controller/company.controller";
import * as storageImage from "../helper/cloudinary.helper"
import multer from "multer";
import * as authMiddleware from "../middleware/auth.middleware"
const image_parser = multer({ storage: storageImage.storage});

const router = Router();

router.post("/register",companyValidate.registerPost,companyController.registerPost,
);

router.post("/login",companyValidate.loginPost,companyController.loginPost);


router.patch("/profile",authMiddleware.verifyTokenCompany,image_parser.single("logo"),companyController.profilePatch)





export default router;
