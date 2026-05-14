import "dotenv/config";
import cors from "cors";
import express from "express";
import session from "express-session";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import passport from "./config/passport.js";

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
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

export default app;
