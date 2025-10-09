import { v2 as cloudinary } from 'cloudinary';

import {
    CLOUDINARY_API_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} from '../config/env.config.js'

cloudinary.config({ 
    cloud_name: CLOUDINARY_API_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET,
});

export const toDataURL = (file: Express.Multer.File): string => {
    const base64 = Buffer.from(file.buffer).toString("base64");
    const dataURL = `data:${file.mimetype};base64,${base64}`;
    return dataURL;
};

export const getPublicIdFromFileURL = (fileURL: string): string => {
    const FileNameUsingSubstring = fileURL.substring(
        fileURL.lastIndexOf("/") + 1
    );
    const publicId = FileNameUsingSubstring.substring(0, FileNameUsingSubstring.lastIndexOf('.'));
    return publicId;
};

// export const getPublicIdFromFileURL = (fileURL: string): string => {
//   try {
//     // Ambil path setelah "/upload/"
//     const parts = fileURL.split("/upload/")[1];
//     if (!parts) throw new Error("Invalid Cloudinary URL");

//     // Hilangkan ekstensi file (misalnya .jpg, .png, .webp)
//     const publicId = parts.replace(/\.[^/.]+$/, ""); 
//     return publicId;
//   } catch (err) {
//     console.error("Error extracting public_id:", err);
//     throw new Error("Failed to extract public_id from URL");
//   }
// };

export const CloudinaryService = {
    async uploadFile(file: Express.Multer.File) {
        const fileDataURL = toDataURL(file);
        const result = await cloudinary.uploader.upload(fileDataURL, {
            resource_type: "auto",
        });
        return result;
    },

    async uploadMultipleFile(files: Express.Multer.File[]) {
        const uploadBatch = files.map((file) => this.uploadFile(file));
        const results = await Promise.all(uploadBatch);
        return results;
    },

    async removeFile(fileURL: string) {
        const publicId = getPublicIdFromFileURL(fileURL);
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    },
};
   