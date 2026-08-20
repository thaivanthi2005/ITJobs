import { NextFunction,Request ,Response} from "express";
import jwt from "jsonwebtoken";
import AccountUser from "../model/account-user.model";
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