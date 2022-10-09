import * as Joi from "joi";

export interface Partner {
    uid: string,
    url: string,
    venue_name: string,
    venue_address: string,
    createdIso: string,
}

export const partnerSchema = Joi.object({
    uid: Joi.string().required(),
    url: Joi.string().required(),
    venue_name: Joi.string().required(),
    venue_address: Joi.string().required(),
    createdIso: Joi.string().isoDate().required(),
});
