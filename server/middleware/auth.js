import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(401, "No token, access denied", "NO_TOKEN"));
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError(401, "Token is not valid", "INVALID_TOKEN"));
  }
  next();
};

export default auth;
