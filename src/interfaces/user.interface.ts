import { Request } from "express";
import { IUserToken } from "../interfaces/auth.interface.js";

export interface User {
    fullName : string;
    username : string;
    email : string;
    password : string;
    role : string;
    profilePicture : string;
    isActive : boolean;
    activationCode? : string | null;
    createdAt?: Date;
}

export interface IReqUser extends Request {
    user?: IUserToken;
}