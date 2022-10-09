import { logError } from "../utils/logger";
import { RouteError } from "./route-error";
import { User } from "../models/user";
import * as jwtthen from "jwt-then";
import { fetchRecordById, userTableName } from './helper-airtable'

const jwtSecret = 'indemn.inc'

/**
 * @api {post} authentication How to authenticate
 * @apiDescription We use Json Web Tokens for authentication. When creating an account you will receive a JWT string.
 * @apiName Authentication
 * @apiGroup AA Info
 * @apiHeaderExample {json} Request-Example:
 * {
 *    "authorization": [JWT String]
 * }
 */
export const createJwt = async (uid: string): Promise<string> => {
    return await jwtthen.sign({ uid }, jwtSecret);
};

/**
 * Checks the auth token and returns the user.
 */
export const checkJwt = async (token: string): Promise<User> => {
    try {
        const decoded = (await jwtthen.verify(token, jwtSecret)) as any;
        const user = await fetchRecordById<User>(userTableName, decoded.uid)
        if (!user) {
            throw new RouteError("not-authenticated", "The user has an invalid auth token.");
        }

        return user;
    } catch (e) {
        logError("not-authenticated", e);
        throw new RouteError("not-authenticated", "The user has an invalid auth token.");
    }
};

export const passwordDecode = (password: string): string => {
    return Buffer.from(password, 'base64').toString('ascii')
}

export const passwordEncode = (password: string): string => {
    return Buffer.from(password).toString('base64')
}
