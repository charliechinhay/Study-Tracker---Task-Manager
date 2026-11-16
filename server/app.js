import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import passport from "./config/passport.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import AppError from "./utils/AppError.js";
import {apiLimiter} from "./middleware/rateLimit.js";

const app = express();
app.set("trust proxy", Number(process.env.TRUST_PROXY_HOPS ?? 1));
app.use(helmet());


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
app.use("/api", apiLimiter);
app.use(express.json());
app.use(passport.initialize());
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
