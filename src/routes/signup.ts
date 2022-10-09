import { Request, Response } from "express";
import Joi from "joi";
import { User } from "../models/user";
import { createRecord, fetchUserByEmail, userTableName } from "../utils/helper-airtable";
import { createJwt, passwordEncode } from "../utils/helpers-auth";
import { RouteError } from "../utils/route-error";

const schema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().required(),
    password: Joi.string().required(),
});

/**
 * @api {post} v1/signup
 * @apiDescription signup
 * @apiName signup
 * @apiGroup v1
 * @apiParamExample {json} Request-Example:
 * {
 *      name?: string,
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
 *   statusCode: duplicate-email | invalid-fields
 * }
 */
export const signup = async (req: Request, res: Response) => {
    await schema.validateAsync(req.body)

    // check if user exists
    const user = await fetchUserByEmail(req.body.email)

    if (user) {
        throw new RouteError('duplicate-email', 'The user who has the same email exists')
    }

    const data: User = {
        ...req.body,
        password: passwordEncode(req.body.password),
        isAdmin: true,
        createdIso: new Date().toISOString(),
    }

    const newUser = await createRecord<User>(userTableName, data)
    const jwt = await createJwt(newUser.uid)

    return res.status(200).json({ user: newUser, jwt });
}
