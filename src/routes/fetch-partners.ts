import { Request, Response } from "express";
import { Partner } from "../models/partner";
import { fetchRecords, partnerTableName } from "../utils/helper-airtable";

/**
 * @api {post} v1/fetch-partners
 * @apiDescription fetch partners
 * @apiName fetchPartners
 * @apiGroup v1
 * @apiParamExample {json} Request-Example:
 * {
 * }
 * @apiSuccessExample {json} Success-Response:
 * {
 *     partners: Partner[]
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500
 * {
 *   statusCode: 
 * }
 */
export const fetchPartners = async (req: Request, res: Response) => {
    // check if partner exists
    const partners = await fetchRecords<Partner>(partnerTableName)

    res.status(200).json({ partners })
}
