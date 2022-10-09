import { Request, Response } from "express";
import Joi from "joi";
import { partnerTableName, removeRecords } from "../utils/helper-airtable";

const schema = Joi.object({
    uid: Joi.string().required(),
});

/**
 * @api {post} v1/delete-partner
 * @apiDescription delete partner
 * @apiName deletePartner
 * @apiGroup v1
 * @apiParamExample {json} Request-Example:
 * {
 *     uid: string
 * }
 * @apiSuccessExample {json} Success-Response:
 * {
 *     deleted: boolean
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500
 * {
 *   statusCode: not-fount-partner
 * }
 */
export const deletePartner = async (req: Request, res: Response) => {
    // validate data
    await schema.validateAsync(req.body)

    const recordIds = await removeRecords(partnerTableName, [req.body.uid])

    res.status(200).send(recordIds[0])
}
