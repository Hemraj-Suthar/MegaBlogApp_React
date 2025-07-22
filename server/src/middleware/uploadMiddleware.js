// import multer from 'multer';
// import path from 'path';

// // Configure Multer storage
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'uploads/'),
//     filename: (req, file, cb) => {
//         const uniqueName = `${Date.now()}-${file.originalname}`;
//         cb(null, uniqueName);
//     },
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only JPEG, JPG, and PNG files are allowed.'));
//     }
// };

// // Multer instance
// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
// });

// export default upload;

import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ 
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
 });

 export default upload;
