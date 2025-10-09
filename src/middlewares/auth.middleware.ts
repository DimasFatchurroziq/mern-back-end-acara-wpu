import { Request, Response, NextFunction } from "express";
import { getUserData } from "../utils/jwt.util.js";
import { IReqUser } from "../interfaces/user.interface.js";
import { IUserToken } from "../interfaces/auth.interface.js";



export default (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction): void => {
    const authorization = req.headers?.authorization;

    if (!authorization) {
        res.status(403).json({
            message: "unauthorized",
            data: null,
        });
        return;
    }

    const [prefix, accessToken] = authorization.split(" ");

    if (!(prefix === "Bearer" && accessToken)){
        res.status(403).json({
            message: "unauthorized",
            data: null,
        });
        return;
    }

    const user: IUserToken | null = getUserData(accessToken);

    if (!user) {
        res.status(403).json({
            message: "unauthorized",
            data: null,
        });
        return;
    }

    (req as unknown as IReqUser).user = user;

    next();
}