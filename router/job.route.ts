import { Router } from "express";
import * as jobController from "../controller/job.controller";
import * as storageImage from "../helper/cloudinary.helper"
import * as jobValidate from "../validates/job.validate";
import multer from "multer";
const image_parser = multer({ storage: storageImage.storage});
const router = Router();

router.get('/detail/:id', jobController.detail);

router.post(
  '/apply',
  image_parser.single("fileCV"),
  jobValidate.applyPost,
  jobController.applyPost
);


export default router;