import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import passport from "./config/passport.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import AppError from "./utils/AppError.js";

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CORS_ORIGINS || "").split(","),
]

  .map((o) => o?.trim())
  .filter(Boolean);

const previewPattern = process.env.CORS_PREVIEW_PATTERN
  ? new RegExp(process.env.CORS_PREVIEW_PATTERN)
  : null;

const isAllowedOrigin = (origin) =>
  allowedOrigins.includes(origin) || (previewPattern?.test(origin) ?? false);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new AppError(403, "Origin not allowed", "CORS_NOT_ALLOWED"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET || "test-secret",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
