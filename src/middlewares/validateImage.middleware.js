import { AppError } from "#utils/appError.js";
import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    filesSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    }else{
      cb(new AppError('error', 'Solo se permiten archivos PNG, JPG, WEBP o SVG.', 415));
    }
  }
})