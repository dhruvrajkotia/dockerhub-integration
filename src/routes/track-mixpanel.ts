import { Request, Response } from "express";
import Joi from "joi";
import { mixpanel } from "../utils/helper-mixpanel";

const schema = Joi.object({
    distinct_id: Joi.string().required(),
    properties: Joi.object().pattern(Joi.string(), Joi.any())
});

/**
 * @api {post} v1/track-mixpanel
 * @apiDescription track mixpanel
 * @apiName trackMixpanel
 * @apiGroup v1
 * @apiParamExample {json} Request-Example:
 * {
 *     distinct_id: string
 *     properties: {[propertyName: string]: any}
 * }
 * @apiSuccessExample {json} Success-Response:
 * {
 *     
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500
 * {
 *   
 * }
 */
export const trackMixpanel = async (req: Request, res: Response) => {
    // validate data
    await schema.validateAsync(req.body)

    const { distinct_id, properties } = req.body

    // track an event with optional properties
    mixpanel.track(
        'testEvent',
        {
            distinct_id,
            ip: '127.0.0.1',
            ...properties
        },
        (err) => {
            if (err) {
                // Error handling
                return;
            }

            res.status(200).json('Event added')
        }
    );
}
