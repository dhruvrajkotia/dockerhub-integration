import * as Joi from "joi";

export interface User {
    uid: string;
    name?: string;
    email: string;
    password?: string;
    createdIso: string;
    isAdmin: boolean;
}

export const userSchema = Joi.object<User>({
    uid: Joi.string(),
    name: Joi.string().min(2).max(50).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(3).optional(),
    createdIso: Joi.string().isoDate().required(),
    isAdmin: Joi.boolean().required(),
});
