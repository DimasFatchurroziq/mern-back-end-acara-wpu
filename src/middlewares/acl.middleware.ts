import { Request, Response, NextFunction } from "express";
import { IReqUser } from "../interfaces/user.interface.js";
import { apiError } from "../helpers/apiError.js";

export default (roles: string[]) => {
    return (req: IReqUser, res: Response, next: NextFunction): void => {
        const role = req.user?.role;

        if (!role) throw apiError.unauthorized("Missing authentication credentials.");

        if (!roles.includes(role)) throw apiError.forbidden("Access denied due to insufficient role.");

        next();

    };
};