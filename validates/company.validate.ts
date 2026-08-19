import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const registerPost = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    companyName: Joi.string()
      .required()
      .max(200)
      .messages({
        "string.empty": "Vui lòng nhập tên công ty!",
        "string.max": "Tên công ty không được vượt quá 200 ký tự!"
      }),
    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty": "Vui lòng nhập email!",
        "string.email": "Email không đúng định dạng!"
      }),
    password: Joi.string()
      .required()
      .min(8) // Ít nhất 8 ký tự
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value)) {
          return helpers.error("password.uppercase"); // Ít nhất một chữ cái in hoa
        }
        if (!/[a-z]/.test(value)) {
          return helpers.error("password.lowercase"); // Ít nhất một chữ cái thường
        }
        if (!/\d/.test(value)) {
          return helpers.error("password.number"); // Ít nhất một chữ số
        }
        if (!/[@$!%*?&]/.test(value)) {
          return helpers.error("password.special"); // Ít nhất một ký tự đặc biệt
        }
        return value; // Nếu tất cả điều kiện đều đúng
      })
      .messages({
        "string.empty": "Vui lòng nhập mật khẩu!",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
        "password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
        "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
        "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
      }),
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

export const loginPost = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email()
      .messages({
        "string.empty": "Vui lòng nhập email!",
        "string.email": "Email không đúng định dạng!"
      }),
    password: Joi.string()
      .required()
      .min(8) // Ít nhất 8 ký tự
      .custom((value, helpers) => {
        if (!/[A-Z]/.test(value)) {
          return helpers.error("password.uppercase"); // Ít nhất một chữ cái in hoa
        }
        if (!/[a-z]/.test(value)) {
          return helpers.error("password.lowercase"); // Ít nhất một chữ cái thường
        }
        if (!/\d/.test(value)) {
          return helpers.error("password.number"); // Ít nhất một chữ số
        }
        if (!/[@$!%*?&]/.test(value)) {
          return helpers.error("password.special"); // Ít nhất một ký tự đặc biệt
        }
        return value; // Nếu tất cả điều kiện đều đúng
      })
      .messages({
        "string.empty": "Vui lòng nhập mật khẩu!",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "password.uppercase": "Mật khẩu phải chứa ít nhất một chữ cái in hoa!",
        "password.lowercase": "Mật khẩu phải chứa ít nhất một chữ cái thường!",
        "password.number": "Mật khẩu phải chứa ít nhất một chữ số!",
        "password.special": "Mật khẩu phải chứa ít nhất một ký tự đặc biệt!",
      }),
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