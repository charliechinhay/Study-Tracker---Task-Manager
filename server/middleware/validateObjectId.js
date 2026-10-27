import { objectIdSchema } from "../validation/taskSchemas.js";

const validateObjectId = (req, res, next) => {
  if (!objectIdSchema.safeParse(req.params.id).success) {
    return res.status(400).json({ message: "Invalid task id" });
  }
  next();
};

export default validateObjectId;