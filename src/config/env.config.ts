import dotenv from 'dotenv';

dotenv.config();

export const PORT: number = parseInt(process.env.PORT || "");

export const DATABASE_URL: string = process.env.DATABASE_URL || "";

export const SECRET_PASSWORD_KEY: string = process.env.SECRET_PASSWORD_KEY || "";

export const SECRET_JWT_KEY: string = process.env.SECRET_JWT_KEY || "";

