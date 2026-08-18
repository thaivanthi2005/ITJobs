import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import AccountUser from "../model/account-user.model";

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

    const existAccount = await AccountUser.findOne({
      _id: id,
      email: email,
    });

    if (!existAccount) {
      res.clearCookie("token");
      res.json({
        code: "error",
        message: "Tài khoản không tồn tại !",
      });
      return;
    }

    res.json({
      code: "success",
      infoUser: existAccount,
    });
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