import mongoose from "mongoose";
import { encrypt } from "../utils/encryption.util.js";
import { User } from "../interfaces/user.interface.js";

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
        enum: ["admin", "user"],
        default: "user",
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
    user.password = encrypt(user.password);
    next();
});

UserSchema.methods.toJSON = function(){
    const user = this.toObject();
    delete user.password;
    return user;
};

const userModel = mongoose.model('User', UserSchema);

export default userModel;