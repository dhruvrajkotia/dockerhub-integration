import { Request, Response } from "express";
import Joi from "joi";
import { findPartnerByUrl as fetchPartnerByUrlF } from "../utils/helper-airtable";
import { RouteError } from "../utils/route-error";

const schema = Joi.object({
    url: Joi.string().required(),
});

/**
 * @api {post} v1/fetch-partner-by-url
 * @apiDescription fetch partner by url
 * @apiName fetchPartnerByUrl
 * @apiGroup v1
 * @apiParamExample {json} Request-Example:
 * {
 *     url: string
 * }
 * @apiSuccessExample {json} Success-Response:
 * {
 *     partner: Partner
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500
 * {
 *   statusCode: not-fount-partner
 * }
 */
export const fetchPartnerByUrl = async (req: Request, res: Response) => {
    // validate data
    await schema.validateAsync(req.body)

    // check if partner exists
    const partner = await fetchPartnerByUrlF(req.body.url)
    if (!partner) {
        throw new RouteError('not-fount-partner', `The parnter who has ${req.body.url} as url doesn\'t exist`)
    }

    res.status(200).json({ partner })
}
