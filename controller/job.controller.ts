import { Request, Response } from "express";
import Job from "../model/job.model";
import AccountCompany from "../model/account-company.model";
import CV from "../model/cv.model";

export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const record = await Job.findOne({
      _id: id
    })

    if(!record) {
      res.json({
        code: "error",
        message: "Id không hợp lệ!"
      })
      return;
    }

    const jobDetail = {
      id: record.id,
      title: record.title,
      companyName: "",
      salaryMin: record.salaryMin,
      salaryMax: record.salaryMax,
      images: record.images,
      position: record.position,
      workingForm: record.workingForm,
      companyAddress: "",
      technologies: record.technologies,
      description: record.description,
      companyLogo: "",
      companyId: record.companyId,
      companyModel: "",
      companyEmployees: "",
      companyWorkingTime: "",
      companyWorkOvertime: ""
    };

    const companyInfo = await AccountCompany.findOne({
      _id: record.companyId
    });

    if(companyInfo) {
      jobDetail.companyName = `${companyInfo.companyName}`;
      jobDetail.companyAddress = `${companyInfo.address}`;
      jobDetail.companyLogo = `${companyInfo.logo}`;
      jobDetail.companyModel = `${companyInfo.companyModel}`;
      jobDetail.companyEmployees = `${companyInfo.companyEmployees}`;
      jobDetail.companyWorkingTime = `${companyInfo.workingTime}`;
      jobDetail.companyWorkOvertime = `${companyInfo.workOvertime}`;
    }

    res.json({
      code: "success",
      message: "Thành công!",
      jobDetail: jobDetail
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}

export const applyPost = async (req: Request, res: Response) => {
  req.body.fileCV = req.file ? req.file.path : "";

  const newRecord = new CV(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Đã gửi CV thành công!"
  })
}