const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {});

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({ message: errors[0].message, errors });
  }

  // Da qui in poi req.body contiene solo i campi validati e già convertiti
  req.body = result.data;
  next();
};

export default validate;