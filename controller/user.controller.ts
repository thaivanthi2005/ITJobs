import { Request, Response } from "express";
import AccountUser from "../model/account-user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {AccountRequest} from "../interfaces/request.interface"


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