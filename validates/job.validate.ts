import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const applyPost = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    jobId: Joi.string()
      .required()
      .messages({
        "string.empty": "Không tìm thấy công việc này!"
      }),
    fullName: Joi.string()
      .required()
      .min(5)
      .max(50)
      .messages({
        "string.empty": "Vui lòng nhập họ tên!",
        "string.min": "Họ tên phải có ít nhất 5 ký tự!",
        "string.max": "Họ tên không được vượt quá 50 ký tự!"
      }),
    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty": "Vui lòng nhập email!",
        "string.email": "Email không đúng định dạng!"
      }),
    phone: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(value)) {
          return helpers.error("phone.invalid"); // Định dạng số điện thoại Việt Nam
        }
        return value;
      })
      .messages({
        "string.empty": "Vui lòng nhập số điện thoại!",
        "phone.invalid": "Số điện thoại không đúng định dạng!"
      }),
    fileCV: Joi.string().allow('')
  });

  const { error } = schema.validate(req.body);

  if(error) {
    const errorMessage = error.details[0].message;

    res.json({
      code: "error",
      message: errorMessage
    });
    return;
  }

  next();
}