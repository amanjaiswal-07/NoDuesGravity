const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

/**
 * PDF files MUST be uploaded with resource_type: 'raw' to Cloudinary.
 * Images use resource_type: 'image'.
 * We use a dynamic params function so the resource_type is set per file.
 */
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const isPdf = file.mimetype === 'application/pdf' ||
            file.originalname.toLowerCase().endsWith('.pdf');

        return {
            folder: 'nodues',
            resource_type: isPdf ? 'raw' : 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        };
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = upload;
