import { Request, Response } from "express";

/**
 * @api {post} v1/account/me
 * @apiDescription fetchMe
 * @apiName fetchMe
 * @apiGroup v1
 * @apiParamExample {json} Request-Example:
 * {
 * }
 * @apiSuccessExample {json} Success-Response:
 * {
 *     user: User,
 * }
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 500
 * {
 *   statusCode: unauthorised
 * }
 */
export const fetchMe = async (req: Request, res: Response) => {
    return res.status(200).json({ user: req.user });
}
