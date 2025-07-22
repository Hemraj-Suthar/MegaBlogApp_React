import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("File path not found");
            return null;
        }

        // upload the file to cloudinary
        const uploadResult = await cloudinary.uploader.upload(localFilePath.path, {
            resource_type: "auto"
        })

        console.log("file is uploaded to cloudinary successfully", uploadResult.url);
        fs.unlinkSync(localFilePath.path);
        return uploadResult;
    } catch (error) {
        // remove the temporary file after error
        fs.unlinkSync(localFilePath.path);
        console.log("Error in uploading to cloudinary", error);
        return null;
    }
}

export default uploadOnCloudinary;