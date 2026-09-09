import { Router } from "express";
import * as userController from "../controller/user.controller";
import * as userValidate from "../validates/user.validate";
import * as storageImage from "../helper/cloudinary.helper"
import * as authMiddleware from "../middleware/auth.middleware"
import multer from "multer";
const image_parser = multer({ storage: storageImage.storage});
const router = Router();

router.post(
  "/register",
  userValidate.registerPost,
  userController.registerPost,
);

router.post("/login", userValidate.loginPost, userController.loginPost);

router.patch("/profile",authMiddleware.verifyTokenUser,image_parser.single("avatar"), userController.Profile)

router.get(
  '/cv/list', 
  authMiddleware.verifyTokenUser,
  userController.listCV
);

export default router;
