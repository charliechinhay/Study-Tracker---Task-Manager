import multer from "multer";
import AppError from "../utils/AppError.js";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(
      new AppError(
        400,
        "Only JPG, PNG or WEBP images are allowed",
        "INVALID_FILE_TYPE",
      ),
    );
  },
});