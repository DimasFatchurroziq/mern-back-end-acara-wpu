import { Types } from 'mongoose';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { SECRET_PASSWORD_KEY } from '../config/env.config.js';

export interface IUserToken
  extends Omit<
    User,
    | "password"
    | "activationCode"
    | "isActive"
    | "email"
    | "fullName"
    | "profilePicture"
    | "username"
  > {
  id?: Types.ObjectId;
}



export const generateToken = (user: IUserToken): string => {
    const token = jwt.sign(user, SECRET_PASSWORD_KEY, {
        expiresIn: "1h",
    });
    return token;
}

export const getUserData = (token: string) => {
    const user = jwt.verify(token, SECRET_PASSWORD_KEY) as IUserToken;
    return user;
}