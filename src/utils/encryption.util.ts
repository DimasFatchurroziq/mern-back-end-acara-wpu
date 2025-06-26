import crypto from "crypto";
import { SECRET_PASSWORD_KEY } from "../config/env.config.js";

export const encrypt = (password: string): string => {
    const encrypted = crypto
    .pbkdf2Sync(password, SECRET_PASSWORD_KEY, 1000, 64, "sha512")
    .toString("hex");
    return encrypted;
}