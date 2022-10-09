import { Request, Response } from "express";
import Joi from "joi";
import { fetchUserByEmail } from "../utils/helper-airtable";
import { createJwt, passwordDecode } from "../utils/helpers-auth";
import { RouteError } from "../utils/route-error";

const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});

/**
 * @api {post} v1/login
 * @apiDescription login
 * @apiName login
 * @apiGroup v1
 * @apiParamExample {json} Request-Example:
 * {
 *      email: string,
 *      password: string
 * }
 * @apiSuccessExample {json} Success-Response:
 * {
 *     user: User,
 *     jwt: string
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500
 * {
 *   statusCode: no-user-exists | invalid-fields | wrong-password
 * }
 */
export const login = async (req: Request, res: Response) => {
    await schema.validateAsync(req.body)

    // check if user exists
    const user = await fetchUserByEmail(req.body.email)

    if (!user) {
        throw new RouteError('no-user-exists', 'The particular user doesn\'t exist')
    }

    // check password
    if (passwordDecode(user.password) !== req.body.password) {
        throw new RouteError('wrong-password', 'Wrong password')
    }

    const jwt = await createJwt(user.uid)

    return res.status(200).json({ user, jwt });
}
