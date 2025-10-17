import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.model.js";
import { CreateUserInput, LoginUserInput, ActivateUserInput } from "../validations/user.schema.js";
import { encrypt } from "../utils/encryption.util.js";
import { generateToken } from "../utils/jwt.util.js";
import { IReqUser } from "../interfaces/user.interface.js";
import { apiResponse } from "../helpers/apiResponse.js";
import { apiError } from "../helpers/apiError.js";

export const authController = {
    async register(req: Request<{}, {}, CreateUserInput, {}>, res: Response, next: NextFunction): Promise<void> {
        try {
            const { fullName, username, email, password } = req.body;

            const existingUserByUsername = await userModel.findOne({
                username,
            });

            if (existingUserByUsername) throw apiError.conflict("This username has already been used.");

            const existingUserByEmail = await userModel.findOne({
                email,
            });

            if (existingUserByEmail) throw apiError.conflict("This email has already been used.");

            const createUSer = await userModel.create({
                fullName,
                username,
                email,
                password
            });

            apiResponse.created(res, createUSer, "User created successfully.");
            return;

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

            if (!identifier) throw apiError.badRequest("Email or Username is required");

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
            
            if (!userByIdentifier) throw apiError.unauthorized("asu salah cokkk");
            
            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

            if (!validatePassword) throw apiError.unauthorized("Credential is invalid");

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
            });

            apiResponse.success(res, token, "User logged in successfully.");
            return;

        } catch (error){
            next(error);
        } 
    },

    async me(req: IReqUser, res: Response, next: NextFunction): Promise<void> {
        try{
            const user = req.user;
            const result = await userModel.findById(user?.id);

            if (!result) throw apiError.notFound("User profile not found");

            apiResponse.success(res, result, "User got profile successfully.");
            return;

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

            if (!user) throw apiError.badRequest("Activation code is invalid.");

            if (user.isActive) throw apiError.badRequest("This account has already activated.");

            user.isActive = true;
            user.activationCode = null;
            await user.save();
            
            apiResponse.success(res, user, "User activated successfully.");
            return;    

        } catch (error) {
            next(error)
        };
    },
};