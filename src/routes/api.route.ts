import { Request, Response, NextFunction } from "express";
import express from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { activateUserSchema, createUserSchema, loginUserSchema } from "../validations/user.schema.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import aclMiddleware from "../middlewares/acl.middleware.js";
import { ROLES } from "../utils/constant.js";

const router = express.Router();

router.post('/auth/register', validate({body: createUserSchema}), authController.register);

router.post('/auth/login', validate({body: loginUserSchema}), authController.login);

router.get('/auth/me', authMiddleware, authController.me);

router.get('/auth/activation', validate({query: activateUserSchema}), authController.activation);

router.get('/test-acl', 
    [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])],
        (req: Request, res: Response, next: NextFunction) => {
            res.status(200).json({
                message: "OK",
                data: "succeess",
            });
        }
    );

export default router;