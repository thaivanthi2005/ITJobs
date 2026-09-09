import { Request, Response } from "express";
import AccountCompany from "../model/account-company.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {AccountRequest} from "../interfaces/request.interface"
import Job from "../model/job.model";
import CV from "../model/cv.model"
import AccountUser from "../model/account-user.model"

export const registerPost = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  const existAccount = await AccountUser.findOne({
    email: email,
  });

  if (existAccount) {
    res.json({
      code: "error",
      message: "Email đã tồn tại",
    });
    return;
  }

  //Mã hóa mật khẩu bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const newAccount = new AccountUser({
    fullName: fullName,
    email: email,
    password: hashedPass,
  });

  await newAccount.save();

  res.json({
    code: "SUCCESS",
    message: "Đăng ký thành công",
  });
};

export const loginPost = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existAccount = await AccountUser.findOne({ email: email });
  if (!existAccount) {
    res.json({
      code: "error",
      message: "Email không tồn tại !",
    });
    return;
  }
  const isPassValid = await bcrypt.compare(
    password,
    `${existAccount.password}`,
  );
  if (!isPassValid) {
    res.json({
      code: "error",
      message: "Mật khẩu không đúng !",
    });
    return;
  }
  const token = jwt.sign(
    {
      id: existAccount.id,
      email: existAccount.email,
    },
    `${process.env.JWT_SECRET}`,
    {
      expiresIn: "1d", //Token thời hạn 1day
    },
  );

  res.cookie("token", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false, //false : http, true:https
    sameSite: "lax", // cho phép gửi cookie cho các domain
  });

  res.json({
    code: "success",
    message: "Đăng nhập thành công !",
  });
};

export const Profile = async (req: AccountRequest, res: Response) => {

  if(req.file){
    req.body.avatar = req.file.path;
  }else{
    delete req.body.avatar
  }

  await AccountUser.updateOne({
    _id:req.account.id,
  },req.body);


  res.json({
    code:"succes",
    message:"Cập nhật thành công ",
  })
}

export const listCV = async (req: AccountRequest, res: Response) => {
  const userEmail = req.account.email;

  const listCV = await CV
    .find({
      email: userEmail
    })
    .sort({
      createdAt: "desc"
    })

  const dataFinal = [];

  for (const item of listCV) {
    const dataItemFinal = {
      id: item.id,
      jobTitle: "",
      companyName: "",
      jobSalaryMin: 0,
      jobSalaryMax: 0,
      jobPosition: "",
      jobWorkingForm: "",
      status: item.status,
    };

    const infoJob = await Job.findOne({
      _id: item.jobId
    })

    if(infoJob) {
      dataItemFinal.jobTitle = `${infoJob.title}`;
      dataItemFinal.jobSalaryMin = parseInt(`${infoJob.salaryMin}`);
      dataItemFinal.jobSalaryMax = parseInt(`${infoJob.salaryMax}`);
      dataItemFinal.jobPosition = `${infoJob.position}`;
      dataItemFinal.jobWorkingForm = `${infoJob.workingForm}`;

      const infoCompany = await AccountCompany.findOne({
        _id: infoJob.companyId
      })

      if(infoCompany) {
        dataItemFinal.companyName = `${infoCompany.companyName}`;
        dataFinal.push(dataItemFinal);
      }
    }
  }

  res.json({
    code: "success",
    message: "Lấy danh sách CV thành công!",
    listCV: dataFinal
  })
}