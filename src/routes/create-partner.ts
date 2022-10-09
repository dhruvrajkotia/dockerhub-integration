import { Request, Response } from "express";
import Joi from "joi";
import { Partner, partnerSchema } from "../models/partner";
import { createRecord, findPartnerByUrl, partnerTableName } from "../utils/helper-airtable";
import { RouteError } from "../utils/route-error";

const schema = Joi.object({
    url: Joi.string().required(),
    venue_name: Joi.string().required(),
    venue_address: Joi.string().required(),
});

/**
 * @api {post} v1/create-partner
 * @apiDescription create new partner
 * @apiName createPartner
 * @apiGroup v1
 * @apiParamExample {json} Request-Example:
 * {
 *     url: string,
 *     venue_name: string,
 *     venue_address: string
 * }
 * @apiSuccessExample {json} Success-Response:
 * {
 *      partner: Partner
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500
 * {
 *   statusCode: duplicated-url | invalid-fields
 * }
 */
export const createPartner = async (req: Request, res: Response) => {
    // validate data
    await schema.validateAsync(req.body)

    // check if url is unique
    const partner = await findPartnerByUrl(req.body.url)

    if (partner) {
        throw new RouteError('duplicated-url', 'parnter who has same url does exist')
    }

    const newPartner: Omit<Partner, 'uid'> = {
        ...req.body,
        createdIso: new Date().toISOString()
    }

    const response = await createRecord<Partner>(partnerTableName, newPartner)
    await partnerSchema.validateAsync(response)

    res.status(200).json({ partner: response })
}
