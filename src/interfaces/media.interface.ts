import { Request } from "express";

export interface IUploadFile extends Request {
    file?: Express.Multer.File; 
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
};

export interface IRemoveFile {
 fileURL?: string;
};