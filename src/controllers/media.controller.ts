import { Request, Response, NextFunction } from "express";
import { CloudinaryService } from "../utils/uploader.js";
import { IRemoveFile, IUploadFile } from "../interfaces/media.interface.js";
import { IReqUser } from "../interfaces/user.interface.js";
import { apiResponse } from "../helpers/apiResponse.js";
import { apiError } from "../helpers/apiError.js";

export const mediaController = {
    async uploadSingle (req: IUploadFile & IReqUser, res: Response, next: NextFunction): Promise<void> { //single(req: IReqUser & IUploadFile, res: Response)

        if (!req.file) throw apiError.badRequest("No file was uploaded.");

        try {
            const result = await CloudinaryService.uploadFile(
                req.file as Express.Multer.File,
            );

            apiResponse.success(res, result, "Single file uploaded successfully.");
            return;
            
        } catch (error) {
            next(error);
        }
    }, 

    async uploadMultiple (req: IUploadFile & IReqUser, res: Response, next: NextFunction) : Promise<void> {
        const filesArray = Array.isArray(req.files) ? req.files : null;

        if (!filesArray || filesArray.length === 0) throw apiError.badRequest("No files was uploaded.");

        try {
            const result = await CloudinaryService.uploadMultipleFile(
                req.files as Express.Multer.File[],
            );

            apiResponse.success(res, result, "Multiple file uploaded successfully.");
            return;

        } catch (error) {
            next(error);
        };
    },

    async removeFile (req: IRemoveFile & IReqUser, res: Response, next: NextFunction) : Promise<void> {
        try {
            const { fileURL } = req.body as unknown as IRemoveFile;

            if (!fileURL) throw apiError.badRequest("No file was deleted.");

            const result = await CloudinaryService.removeFile(fileURL);

            apiResponse.success(res, result, "File deleted successfully.");
            return;

        } catch (error) {
            next (error);
        } ;
    },
};