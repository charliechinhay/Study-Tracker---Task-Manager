
import AppError from "../utils/AppError.js";
import { objectIdSchema } from "../validation/taskSchemas.js";

const validateObjectId = (req, res, next) => {
  if (!objectIdSchema.safeParse(req.params.id).success) {
    return next(new AppError(400, "Invalid task id", "INVALID_OBJECT_ID"));
  }
  next();
};

export default validateObjectId;