import { Request, Response } from "express"
import { fetchRecords, insurancePolicyDetailsTableName } from "../utils/helper-airtable"
import { InsuranceDetails } from "../models/insurancedetails";
import Joi from "joi";


const schema = Joi.object({
    filterQuery: Joi.string().required(),
});

export const fetchDetailsFromAirtable = async (req: Request, res: Response) => {
    
    await schema.validateAsync(req.body)
    
    const filterQuery = req.body.filterQuery;

    const records =await fetchRecords<InsuranceDetails>(insurancePolicyDetailsTableName, filterQuery)

    res.status(200).json({ records })
}
