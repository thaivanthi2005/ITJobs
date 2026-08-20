import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import AccountUser from "../model/account-user.model";
import AccountCompany from "../model/account-company.model";

export const check = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.json({
        code: "error",
        message: "Token không hợp lệ !",
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`,
    ) as jwt.JwtPayload;

    const { id, email } = decoded;

    //USER
    const existAccountUser = await AccountUser.findOne({
      _id: id,
      email: email,
    });

    if(existAccountUser){
      const infoUser = {
        id:existAccountUser.id,
        fullName:existAccountUser.fullName,
        email:existAccountUser.email,
        avatar:existAccountUser.avatar,
        phone:existAccountUser.phone,
      }
      res.json({
      code: "success",
      message:"TOKEN HỢP LỆ",
      infoUser : infoUser,
    });
    return
    }

    const existAccountCompany = await AccountCompany.findOne({
      _id: id,
      email: email,
    });

    //COMPANY
    if(existAccountCompany){
      const infoCompany = {
        id:existAccountCompany.id,
        companyName:existAccountCompany.companyName,
        email:existAccountCompany.email,
      }
      console.log(infoCompany);
      res.json({
      code: "success",
      message:"TOKEN HỢP LỆ",
      infoCompany : infoCompany,
    });
    return;
    }

    if (!existAccountUser && !existAccountCompany) {
      res.clearCookie("token");
      res.json({
        code: "error",
        message: "Tài khoản không tồn tại !",
      });
      return;
    } 

  } catch (error) {
    res.json({
      code: "error",
      message: "Có lỗi xảy ra !",
    });
  }
};

export const logout = async (req:Request,res:Response) =>{
    res.clearCookie('token');
    res.json({
      code: "Thành CÔng",
      message: "ĐĂNG XUẤT THÀNH CÔNG",
    });
  }