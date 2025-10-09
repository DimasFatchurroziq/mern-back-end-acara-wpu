import { Request, Response, NextFunction } from "express";
import { IReqUser } from "../interfaces/user.interface.js";

export default (roles: string[]) => {
    return (req: IReqUser, res: Response, next: NextFunction): void => {
        const role = req.user?.role;

        if (!role) {
            res.status(401).json({
                    message: "Unauthorized: Missing authentication credentials.",
                    data: null,
                });
            return;
        };

        if (!roles.includes(role)) {
            res.status(403).json({
                    message: "Forbidden: Access denied due to insufficient role.",
                    data: null,
                });
            return;
        };

        next();

    };
};