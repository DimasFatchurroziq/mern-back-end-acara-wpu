import { Request, Response, NextFunction } from "express";
import { getUserData } from "../utils/jwt.util.js";
import { IReqUser } from "../interfaces/user.interface.js";
import { IUserToken } from "../interfaces/auth.interface.js";
import { apiError } from "../helpers/apiError.js";

export default (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction): void => {
    const authorization = req.headers?.authorization;

    if (!authorization) throw apiError.unauthorized();

    const [prefix, accessToken] = authorization.split(" ");

    if (!(prefix === "Bearer" && accessToken)) throw apiError.unauthorized();

    const user: IUserToken | null = getUserData(accessToken);

    if (!user) throw apiError.unauthorized();

    (req as unknown as IReqUser).user = user;

    next();
}