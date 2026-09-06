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
  let totalPage = 0;
  let totalRecord = 0;
  if(Object.keys(req.query).length > 0) {
    const find: any = {};

    //language
    if(req.query.language) {
      find.technologies = req.query.language;
    }
    
    // City
    if(req.query.city) {
      const city = await City.findOne({
        name:req.query.city as string
      })

      if(city) {
        const listAccountCompanyInCity = await AccountCompany.find({
          city: city.id
        })

        const listIdAccountCompany = listAccountCompanyInCity.map(item => item.id);

        find.companyId = { $in: listIdAccountCompany };
      }
    }

    //company
    if(req.query.company) {
      const accountCompany = await AccountCompany.findOne({
        companyName: req.query.company as string
      })

      find.companyId = accountCompany?.id;
    }

    //keyword
    if(req.query.keyword){
      const keywordRegex = new RegExp(`${req.query.keyword}`, "i");
      find["$or"] = [
        { title: keywordRegex },
        { technologies: keywordRegex }
      ];
    }

    //position 
    if(req.query.position) {
      find.position = req.query.position;
    }

    //workingForm
    if(req.query.workingForm){
      find.workingForm = req.query.workingForm;
    }
    

    //pagination
    const limitItems = 2;
    let page = 1;
    if(req.query.page){
      const currentPage = parseInt(`${req.query.page}`);
      if(currentPage && currentPage>0) page = currentPage;
        else page=1;
    }
    const totalRecord = await Job.countDocuments(find);

      const totalPage = Math.ceil(totalRecord / limitItems);

      if(page > totalPage && totalPage != 0) {
      page = totalPage;
    }
    const skip = (page - 1) * limitItems;

    const jobs = await Job.find(find).sort({createdAt: "desc"}).limit(limitItems).skip(skip);

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
    totalPage: totalPage,
    totalRecord: totalRecord
  })
}