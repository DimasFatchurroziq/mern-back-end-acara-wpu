import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";
import { CreateUserInput, LoginUserInput, ActivateUserInput } from "../validations/user.schema.js";
import { encrypt } from "../utils/encryption.util.js";
import { generateToken } from "../utils/jwt.util.js";
import { IReqUser } from "../middlewares/auth.middleware.js";

export const authController = {
    async register(req: Request<{}, {}, CreateUserInput, {}>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { fullName, username, email, password } = req.body;

            const existingUserByUsername = await userModel.findOne({
                username,
            });

            if (existingUserByUsername) {
                res.status(409).json({
                    message: "This username has already been used.",
                    data: null,
                });
                return;
            };

            const existingUserByEmail = await userModel.findOne({
                email,
            });

            if (existingUserByEmail) {
                res.status(409).json({
                    message: "This email has already been used.",
                    data: null,
                });
                return;
            };

            const createUSer = await userModel.create({
                fullName,
                username,
                email,
                password
            });
            res.status(201).json(createUSer); 
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request<{}, {}, LoginUserInput, {}>, res: Response, next: NextFunction): Promise<void> {
        try {

            const { password } = req.body;

            let identifier: string; 

            if ('email' in req.body) {
                identifier = req.body.email;
            } else {
                identifier = req.body.username;
            };

            if (!identifier) {
                res.status(400).json({
                    message: "email or username is required",
                    data: null,
                });
                return;
            };

            const userByIdentifier = await userModel.findOne({
                $or: [
                    {
                        email: identifier,
                    },
                    {
                        username: identifier,
                    }
                ],
                isActive : true,
            });
            
            if(!userByIdentifier){
                res.status(401).json({
                    message: "credential is invalid",
                    data: null,
                }); 
                return;
            };
            
            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

            if(!validatePassword){
                res.status(401).json({
                    message: "credential is invalid",
                    data: null,
                }); 
                return;
            };

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
            });

            res.status(200).json({
                message: "Login success",
                data: token,
            }); return;
        } catch (error){
            next(error);
        } 
    },

    async me(req: IReqUser, res: Response, next: NextFunction): Promise<void> {
        try{
            const user = req.user;
            const result = await userModel.findById(user?.id);

            if (!result) {
                res.status(404).json({
                    message: "User profile not found.",
                    data: null,
                });
                return;
            };

            res.status(200).json({
                message: "Success get profile user",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async activation(req: Request<{}, {}, {}, ActivateUserInput>, res: Response, next: NextFunction): Promise<void> {
        try{
            const { code } = req.query;

            const user = await userModel.findOne({
                activationCode : code,
            });

            if (!user) {
                res.status(400).json({
                    message: "Activation code is invalids",
                    data: null,
                });
                return;
            };

            if (user.isActive) {
                res.status(400).json({
                    message: "Akun Anda sudah aktif. Silakan login.",
                    data: null,
                });
                return;
            };

            user.isActive = true;
            user.activationCode = null;
            await user.save();

            res.status(200).json({
                message: "Success activation user",
                data: user,
            });
            return;     
        } catch (error) {
            next(error)
        }
    }
};