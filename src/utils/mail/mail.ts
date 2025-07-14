import nodemailer from "nodemailer"
import { ISendMail } from "../../interfaces/sendmail.interface.js";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import { 
    EMAIL_SMTP_SERVICE_NAME, 
    EMAIL_SMTP_HOST, 
    EMAIL_SMTP_SECURE,
    EMAIL_SMTP_PORT, 
    EMAIL_SMTP_USER, 
    EMAIL_SMTP_PASS, 
} from "../../config/env.config.js";

export const transporter = nodemailer.createTransport({
    service : EMAIL_SMTP_SERVICE_NAME,
    host : EMAIL_SMTP_HOST,
    port : EMAIL_SMTP_PORT,
    secure : EMAIL_SMTP_SECURE,
    auth : {
        user : EMAIL_SMTP_USER,
        pass : EMAIL_SMTP_PASS,
    },
    requireTLS : true,
});

export const sendMail = async({from, to, subject, html} : ISendMail): Promise<any> => {
    try {
        const result = await transporter.sendMail({
            from,
            to,
            subject,
            html,
        });
        return result;
    } catch (error) {
        console.error("Error sending email:", error);
    };
};

export const renderMailHtml = async(template: string, data: any): Promise<string> => {
    try {       
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const content = await ejs.renderFile(
            path.join(__dirname, `templates/${template}`),
            data,
        );
        return content as string;
    } catch (error) {
        console.error("Error render email:", error);
        return "";
    };
};