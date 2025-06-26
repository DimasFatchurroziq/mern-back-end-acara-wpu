import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";
import { CreateUserInput, LoginUserInput } from "../validations/user.schema.js";
import { encrypt } from "../utils/encryption.util.js";
import { generateToken } from "../utils/jwt.util.js";


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
    }
}