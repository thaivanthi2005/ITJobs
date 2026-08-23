import { NextFunction,Request ,Response} from "express";
import jwt from "jsonwebtoken";
import AccountUser from "../model/account-user.model";
import AccountCompany from "../model/account-company.model"
import {AccountRequest} from "../interfaces/request.interface"


export const verifyTokenUser = async (req: AccountRequest, res: Response,next:NextFunction) =>{
try{
const token = req.cookies.token;
if(!token){
    res.json({
        code:"error",
        message:"Vui lòng gửi kèm TOKEN !",
    })
    return;
}
const decoded = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`,
    ) as jwt.JwtPayload;

    const { id, email } = decoded;
const existAccountUser = await AccountUser.findOne({
      _id: id,
      email: email,
    });

    if(!existAccountUser){
        res.json({
        code:"error",
        message:" TOKEN Không hợp lệ !",
    })
    return;
    }

    req.account = existAccountUser;
    next();
}catch{
    res.clearCookie("token");
    res.json({
        code:"error",
        message:" TOKEN Không hợp lệ !",
    })
}
}

export const verifyTokenCompany = async (req: AccountRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      res.json({
        code: "error",
        message: "Vui lòng gửi kèm theo token!"
      });
      return;
    }

    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as jwt.JwtPayload; // Giải mã token
    const { id, email } = decoded;

    const existAccount = await AccountCompany.findOne({
      _id: id,
      email: email
    });

    if(!existAccount) {
      res.clearCookie("token");
      res.json({
        code: "error",
        message: "Token không hợp lệ!"
      });
      return;
    }

    req.account = existAccount;

    next();
  } catch (error) {
    res.clearCookie("token");
    res.json({
      code: "error",
      message: "Token không hợp lệ!"
    });
  }
}