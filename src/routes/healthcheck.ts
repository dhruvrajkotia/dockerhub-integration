import { Request, Response } from "express";

import { RouteError } from "../utils/route-error";

export const healthCheck = async (req: Request, res: Response) => {
    // check password
    // console.log("this hit healthcheck");

    return res.json({ status: "ok" });
}