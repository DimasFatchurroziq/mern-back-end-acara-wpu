import { IUserToken } from '../interfaces/auth.interface.js';
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from '../config/env.config.js';
import { error } from 'console';

export const generateToken = (user: IUserToken): string => {
    const token = jwt.sign(user, SECRET_JWT_KEY, {
        expiresIn: "1h",
    });
    return token;
}

export const getUserData = (token: string) => {
  try {
    const user = jwt.verify(token, SECRET_JWT_KEY) as IUserToken;
    return user;
  } catch(error){
    return null;
  }
}