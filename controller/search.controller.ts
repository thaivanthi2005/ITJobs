import { Request, Response } from "express";
import AccountCompany from "../model/account-company.model";
import JobCompany from "../model/job.model";
import City from "../model/city.model"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {AccountRequest} from "../interfaces/request.interface"
import Job from "../model/job.model";


export const search = async (req: Request, res: Response) => {
  const dataFinal = [];
  if(Object.keys(req.query).length > 0) {
    const find: any = {};

    if(req.query.language) {
      find.technologies = req.query.language;
    }
    
    const jobs = await Job.find(find).sort({createdAt: "desc"})

    for(const item of jobs){
      const itemFinal = {
        id: item.id,
        companyLogo: "",
        title: item.title,
        companyName: "",
        salaryMin: item.salaryMin,
        salaryMax: item.salaryMax,
        position: item.position,
        workingForm: item.workingForm,
        companyCity: "",
        technologies: item.technologies,
      };

      const companyInfo = await AccountCompany.findOne({
        _id:item.companyId
      })

      if(companyInfo){
        itemFinal.companyLogo = `${companyInfo.logo}`;
        itemFinal.companyName = `${companyInfo.companyName}`;

        const citys = await City.findOne({
          _id:companyInfo.city
        })
        itemFinal.companyCity = `${citys?.name}`;
      }

      dataFinal.push(itemFinal);
    }
  }
  res.json({
    code: "success",
    message: "Thành công!",
    jobs: dataFinal,
  })
}