import dotenv from 'dotenv';

dotenv.config();

export const PORT: number = Number(process.env.PORT) || 3000;

export const DATABASE_URL: string = process.env.DATABASE_URL || "";

export const SECRET_PASSWORD_KEY: string = process.env.SECRET_PASSWORD_KEY || "";

export const SECRET_JWT_KEY: string = process.env.SECRET_JWT_KEY || "";

export const EMAIL_SMTP_SERVICE_NAME: string = process.env.EMAIL_SMTP_SERVICE_NAME || "";

export const EMAIL_SMTP_HOST: string = process.env.EMAIL_SMTP_HOST || "";

export const EMAIL_SMTP_SECURE: boolean = process.env.EMAIL_SMTP_SECURE === 'true';

export const EMAIL_SMTP_PORT: number = Number(process.env.EMAIL_SMTP_PORT) || 465;

export const EMAIL_SMTP_USER: string = process.env.EMAIL_SMTP_USER || "";

export const EMAIL_SMTP_PASS: string = process.env.EMAIL_SMTP_PASS || "";

export const CLIENT_HOST: string = process.env.CLIENT_HOST || "http://localhost:3001";





