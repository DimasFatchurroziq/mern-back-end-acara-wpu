import { Request, Response, NextFunction } from "express";
import { CloudinaryService } from "../utils/uploader.js";
import { IRemoveFile, IUploadFile } from "../interfaces/media.interface.js";
import { IReqUser } from "../interfaces/user.interface.js";

export const mediaController = {
    async uploadSingle (req: IUploadFile & IReqUser, res: Response, next: NextFunction): Promise<void> { //single(req: IReqUser & IUploadFile, res: Response)
        if (!req.file) {
            res.status(400).json({
                    message: "No file was uploaded. Please include a file in the request.",
                    data: null,
                });
            return; 
            };

        try {
            const result = await CloudinaryService.uploadFile(
                req.file as Express.Multer.File,
            );
            res.status(200).json({
                message: "Successfully upload a single file.",
                data: result,
            });
            return;
        } catch (error) {
            next(error);
        }
    }, 

    async uploadMultiple (req: IUploadFile & IReqUser, res: Response, next: NextFunction) : Promise<void> {
        const filesArray = Array.isArray(req.files) ? req.files : null;
        if (!filesArray || filesArray.length === 0) {
            res.status(400).json({
                    message: "No file was uploaded. Please include a file in the request.",
                    data: null,
                });
            return; 
            };

        try {
            const result = await CloudinaryService.uploadMultipleFile(
                req.files as Express.Multer.File[],
            );
            res.status(200).json({
                message: "Suceessfully upload multiple files.",
                data: result,
            });
            return;
        } catch (error) {
            next(error);
        };
    },

    async removeFile (req: IRemoveFile & IReqUser, res: Response, next: NextFunction) : Promise<void> {
        try {
            const { fileURL } = req.body as unknown as IRemoveFile;

            if (!fileURL) {
                res.status(400).json({
                    message: "No file was uploaded. Please include a file in the request.",
                    data: null,
                });
            return; 
            }

            const result = await CloudinaryService.removeFile(fileURL)
            res.status(200).json({
                message: "Suceessfully delete file.",
                data: result,
            });
            return;
        } catch (error) {
            next (error);
        } ;
    },
};