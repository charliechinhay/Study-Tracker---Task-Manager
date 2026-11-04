import AppError from "../utils/AppError.js";


const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {});

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return next(new AppError(400, errors[0].message, "VALIDATION_ERROR", errors));
  }

  req.body = result.data;
  next();
};

export default validate;