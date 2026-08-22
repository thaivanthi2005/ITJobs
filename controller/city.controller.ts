import { Request, Response } from "express";
import City from "../model/city.model"

export const list = async (req: Request, res: Response) => {
  const cityList = await City.find({});

  res.json({
    code: "success",
    message: "Cập nhật thành công!",
    cityList: cityList
  })
}