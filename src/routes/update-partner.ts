import { Request, Response } from "express";
import Joi from "joi";
import { Partner } from "../models/partner";
import { findPartnerByUrl, fetchRecordById, partnerTableName, updateRecord } from "../utils/helper-airtable";
import { RouteError } from "../utils/route-error";

const schema = Joi.object({
    uid: Joi.string().required(),
    url: Joi.string().optional(),
    venue_name: Joi.string().optional(),
    venue_address: Joi.string().optional(),
});

/**
 * @api {post} v1/update-partner
 * @apiDescription update partner
 * @apiName updatePartner
 * @apiGroup v1
 * @apiParamExample {json} Request-Example:
 * {
 *     uid: string
 *     url?: string
 *     venue_name?: string
 *     venue_address?: string
 * }
 * @apiSuccessExample {json} Success-Response:
 * {
 *     partner: Partner
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500
 * {
 *   statusCode: not-fount-partner | duplicated-url | invalid-fields
 * }
 */
export const updatePartner = async (req: Request, res: Response) => {
    // validate data
    await schema.validateAsync(req.body)

    // check if partner exists
    const partner = await fetchRecordById<Partner>(partnerTableName, req.body.uid)
    if (!partner) {
        throw new RouteError('not-fount-partner', `The partner does\'t exist`)
    }

    // check if new url is unique
    if (partner.url !== req.body.url) {
        if (await findPartnerByUrl(req.body.url)) {
            throw new RouteError('duplicated-url', 'partner who has same url does exist')
        }
    }

    let data = req.body
    delete data.uid

    const updatedPartner = await updateRecord<Partner>(partnerTableName, partner.uid, data)

    res.status(200).json({ partner: updatedPartner })
}
