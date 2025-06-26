import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";
import { CreateUserInput, LoginUserInput } from "../validations/user.schema.js";
import { encrypt } from "../utils/encryption.util.js";
import { generateToken } from "../utils/jwt.util.js";
import { IReqUser } from "../middlewares/auth.middleware.js";


export const authController = {
    async register(req: Request<{}, {}, CreateUserInput, {}>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { fullName, username, email, password } = req.body;
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
            }

            const userByIdentifier = await userModel.findOne({
                $or: [
                    {
                        email: identifier,
                    },
                    {
                        username: identifier,
                    }
                ]
            });
            
            if(!userByIdentifier){
                res.status(403).json({
                    message: "email or username not found",
                    data: null,
                }); return;
            }
            
            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

            if(!validatePassword){
                res.status(403).json({
                    message: "invalid password",
                    data: null,
                }); return;
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
                    message: "User profile not found.", // Atau "Invalid user ID in token."
                    data: null,
                });
                return;
            }

            res.status(200).json({
                message: "Success get profile user",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}