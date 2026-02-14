"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: 'bakery-profiles',
            resource_type: 'image',
            transformation: [
                { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                { quality: 'auto' },
            ],
        }, (error, result) => {
            if (error) {
                reject(new Error(`Cloudinary upload failed: ${error.message}`));
            }
            else if (result) {
                resolve(result.secure_url);
            }
            else {
                reject(new Error('Cloudinary upload failed: No result returned'));
            }
        });
        // Convert buffer to stream
        const stream = stream_1.Readable.from(file.buffer);
        stream.pipe(uploadStream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map