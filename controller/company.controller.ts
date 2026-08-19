import { Request, Response } from "express";
import AccountCompany from "../model/account-company.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerPost =  async (req: Request, res: Response) =>{
const { fullName, email, password } = req.body;
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
    fullName: fullName,
    email: email,
    password: hashedPass,
  });

  await newAccount.save();

  res.json({
    code: "SUCCESS",
    message: "Đăng ký thành công",
  });
}

