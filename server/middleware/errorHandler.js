import mongoose from "mongoose";
import multer from "multer";
import AppError from "../utils/AppError.js";

// translate known external library errors into AppError; null = unexpected error
const toAppError = (err) => {
  if (err instanceof AppError) return err;
  if (err.type === "entity.parse.failed") {
    return new AppError(400, "Invalid JSON body", "INVALID_JSON");
  }
  if (err.type === "entity.too.large") {
    return new AppError(413, "Request body too large", "PAYLOAD_TOO_LARGE");
  }
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return new AppError(413, "Image must be at most 2 MB", "FILE_TOO_LARGE");
    }
    return new AppError(400, err.message, "UPLOAD_ERROR");
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const first = Object.values(err.errors)[0];
    return new AppError(400, first?.message || "Invalid data", "VALIDATION_ERROR");
  }
  if (err instanceof mongoose.Error.CastError) {
    return new AppError(400, "Invalid id", "INVALID_ID");
  }
  if (err.code === 11000) {
    return new AppError(409, "Resource already exists", "DUPLICATE");
  }
  return null;
};

export const notFound = (req, res, next) => {
  next(new AppError(404, "Route not found", "NOT_FOUND"));
};

// must have 4 parameters to be recognized by Express as an error handler
export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  const appError = toAppError(err);

  if (!appError) {
    //details of the error are logged for debugging purposes, but the client receives a generic message
    console.error(`[${req.method} ${req.originalUrl}]`, err);
    return res
      .status(500)
      .json({ message: "Server error", code: "INTERNAL_ERROR" });
  }

  res.status(appError.status).json({
    message: appError.message,
    code: appError.code,
    ...(appError.errors && { errors: appError.errors }),
  });
};