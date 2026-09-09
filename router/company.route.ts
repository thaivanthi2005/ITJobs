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


router.post("/job/create",authMiddleware.verifyTokenCompany,image_parser.array('images', 8),companyController.jobCreate)

router.get("/job/list",authMiddleware.verifyTokenCompany,companyController.jobList)

router.get(
  '/job/edit/:id', 
  authMiddleware.verifyTokenCompany,
  companyController.editJob
);

router.patch(
  '/job/edit/:id', 
  authMiddleware.verifyTokenCompany,
  image_parser.array('images', 8),
  companyController.editJobPatch
);

router.delete(
  '/job/delete/:id', 
  authMiddleware.verifyTokenCompany,
  companyController.deleteJobDel
);

router.get(
  '/list', 
  companyController.list
);

router.get(
  '/detail/:id', 
  companyController.detail
);

router.get(
  '/cv/list', 
  authMiddleware.verifyTokenCompany,
  companyController.listCV
);

router.get(
  '/cv/detail/:id', 
  authMiddleware.verifyTokenCompany,
  companyController.detailCV
);

export default router;
