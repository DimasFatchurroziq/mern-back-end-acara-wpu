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