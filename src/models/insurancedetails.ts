import * as Joi from "joi";

export interface InsuranceDetails {
    wed_ins_cov_peference: string,
    form_wedding_budget_short: string,
    alcohol_bool: string,
    coverage_image: string,
    quote_price: string,
}

export const insuranceDetailsSchema = Joi.object({
    wed_ins_cov_peference: Joi.string().required(),
    form_wedding_budget_short: Joi.string().required(),
    alcohol_bool: Joi.string().required(),
    coverage_image: Joi.string().required(),
    quote_price: Joi.string().required(),
});
