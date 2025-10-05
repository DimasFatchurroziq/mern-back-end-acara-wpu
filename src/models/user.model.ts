import mongoose from "mongoose";
import { encrypt } from "../utils/encryption.util.js";
import { User } from "../interfaces/user.interface.js";
import { renderMailHtml, sendMail } from "../utils/mail/mail.js";
import { CLIENT_HOST, EMAIL_SMTP_USER } from "../config/env.config.js";
import { ROLES } from "../utils/constant.js";

const Schema = mongoose.Schema;

const UserSchema = new Schema<User>({
    fullName: {
        type: Schema.Types.String,
        required: true,
    },
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    password: {
        type: Schema.Types.String,
        required: true,
    },
    role: {
        type: Schema.Types.String,
        enum: [ROLES.ADMIN, ROLES.MEMBER],
        default: ROLES.MEMBER,
    },
    profilePicture: {
        type: Schema.Types.String,
        default: "user.jpg",
    },
    isActive: {
        type: Schema.Types.Boolean,
        default: false,
    },
    activationCode: {
        type: Schema.Types.String,
    }
},
{
    timestamps: true,
});

UserSchema.pre("save", function(next){
    const user = this;
    
    if (user.isModified("password")) {
        user.password = encrypt(user.password);
    };
    if (user.isNew && !user.activationCode) {
        user.activationCode = encrypt(user.id);
    };
    
    next();   
});

UserSchema.post("save", async function(doc, next) {
    try {
        const user = doc;
    
        console.log("send email to :", user.email);
    
        const contentMail = await renderMailHtml("registration-success.ejs", {
            username : user.username,
            fullName : user.fullName,
            email : user.email,
            createdAt : user.createdAt,
            activationLink : `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
        });

        await sendMail({
            from : EMAIL_SMTP_USER,
            to : user.email,
            subject : "Aktivasi Akun Anda",
            html : contentMail,
        });

        next();

    } catch (error) {
        console.error("Error sending email :", error);
        next();
    }
});

UserSchema.methods.toJSON = function(){
    const user = this.toObject();
    delete user.password;
    delete user.activationCode;
    return user;
};

const userModel = mongoose.model('User', UserSchema);

export default userModel;