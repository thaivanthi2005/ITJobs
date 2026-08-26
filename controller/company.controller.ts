import { Request, Response } from "express";
import AccountCompany from "../model/account-company.model";
import JobCompany from "../model/job.model";
import City from "../model/city.model"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {AccountRequest} from "../interfaces/request.interface"


export const registerPost =  async (req: Request, res: Response) =>{
const { companyName, email, password } = req.body;
  const existAccount = await AccountCompany.findOne({
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

  const newAccount = new AccountCompany({
    companyName: companyName,
    email: email,
    password: hashedPass,
  });

  await newAccount.save();

  res.json({
    code: "SUCCESS",
    message: "Đăng ký thành công",
  });
}

export const loginPost = async (req:Request , res:Response) =>{
    const { email, password } = req.body;

  const existAccount = await AccountCompany.findOne({ email: email });
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
}

export const profilePatch = async (req:AccountRequest , res:Response) =>{
  if(req.file) {
    req.body.logo = req.file.path;
  } else {
    delete req.body.logo;
  }

  await AccountCompany.updateOne({
    _id: req.account.id
  }, req.body);

  res.json({
    code: "success",
    message: "Cập nhật thành công!"
  })
}

export const jobCreate = async (req:AccountRequest , res:Response) =>{
  req.body.companyId = req.account.id;
  req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
  req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
  req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
  req.body.images = [];

  // Xử lý mảng images
  if (req.files) {
    for (const file of req.files as any[]) {
      req.body.images.push(file.path);
    }
  }

  const newRecord = new JobCompany(req.body);
  await newRecord.save();

  res.json({
    code: "success",
    message: "Tạo công việc thành công!"
  })
}


export const jobList = async (req:AccountRequest , res:Response) =>{
  const find = {
      companyId: req.account.id
    };
    const limitItems = 3;
    let page = 1;
    if(req.query.page){
      const currentPage = parseInt(`${req.query.page}`);
    if(currentPage > 0) {
      page = currentPage;
    }
    }
    const totalRecord = await JobCompany.countDocuments(find);
  const totalPage = Math.ceil(totalRecord/limitItems);
  if(page > totalPage && totalPage != 0) {
    page = totalPage;
  }
  const skip = (page - 1) * limitItems;
  const jobs = await JobCompany
    .find(find)
    .sort({
      createdAt: "desc"
    }).limit(limitItems).skip(skip);

  const dataFinal = [];

  const city = await City.findOne({
    _id: req.account.city
  })

  for (const item of jobs) {
    dataFinal.push({
      id: item.id,
      companyLogo: req.account.logo,
      title: item.title,
      companyName: req.account.companyName,
      salaryMin: item.salaryMin,
      salaryMax: item.salaryMax,
      position: item.position,
      workingForm: item.workingForm,
      companyCity: city?.name,
      technologies: item.technologies,
    });
  }

  res.json({
    code: "success",
    message: "Lấy danh sách công việc thành công!",
    jobs: dataFinal,
    totalPage: totalPage
  })
}

export const editJob = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;

    const jobDetail = await JobCompany.findOne({
      _id: id,
      companyId: req.account.id
    })

    if(!jobDetail) {
      res.json({
        code: "error",
        message: "Id không hợp lệ!"
      })
      return;
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

export const editJobPatch = async (req: AccountRequest, res: Response) => {
  try {
    const id = req.params.id;

    const jobDetail = await JobCompany.findOne({
      _id: id,
      companyId: req.account.id
    })

    if(!jobDetail) {
      res.json({
        code: "error",
        message: "Id không hợp lệ!"
      })
      return;
    }

    req.body.salaryMin = req.body.salaryMin ? parseInt(req.body.salaryMin) : 0;
    req.body.salaryMax = req.body.salaryMax ? parseInt(req.body.salaryMax) : 0;
    req.body.technologies = req.body.technologies ? req.body.technologies.split(", ") : [];
    req.body.images = [];

    // Xử lý mảng images
    if (req.files) {
      for (const file of req.files as any[]) {
        req.body.images.push(file.path);
      }
    }

    await JobCompany.updateOne({
      _id: id,
      companyId: req.account.id
    }, req.body)

    res.json({
      code: "success",
      message: "Cập nhật thành công!"
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}


export const deleteJobDel = async (req: AccountRequest, res: Response) =>{
  try{
    const id = req.params.id;

    const jobDetail = await JobCompany.findOne({
      _id: id,
      companyId: req.account.id
    })

    if(!jobDetail) {
      res.json({
        code: "error",
        message: "Id không hợp lệ!"
      })
      return;
    }

    await JobCompany.deleteOne({
      _id: id,
      companyId: req.account.id
    })

    res.json({
      code: "success",
      message: "Đã xóa!"
    })
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "Id không hợp lệ!"
    })
  }
}