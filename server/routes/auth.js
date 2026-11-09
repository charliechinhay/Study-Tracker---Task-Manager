import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import passport from "../config/passport.js";
import { sendWelcomeEmail } from "../config/resend.js";
import AppError from "../utils/AppError.js";
import {loginLimiter, signupLimiter} from "../middleware/rateLimit.js";

const router = express.Router();

// post / api/ auth/ register
router.post("/register", signupLimiter, async (req, res) => {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      throw new AppError(400, "All fields are required", "MISSING_FIELDS");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(400, "Email already in use", "EMAIL_IN_USE");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
      isVerified: true,
    });

    // get welcome email
    sendWelcomeEmail(email).catch((err) =>
      console.error("Failed to send welcome email:", err),
    );

    res.status(201).json({
      message: "Account created successfully! You can now login.",
    });
});

// post / api/ auth/ login
router.post("/login", loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError(400, "All fields are required", "MISSING_FIELDS");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(400, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    // Check if user registered with Google
    if (!user.password && user.googleId) {
      throw new AppError(400, "This account uses Google login. Please sign in with Google.", "GOOGLE_LOGIN_REQUIRED");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError(400, "Invalid credentials", "INVALID_CREDENTIALS");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
});

// get /api/auth/google
router.get("/google", passport.authenticate("google", { scope: ["email"] }));

// get /api/auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/?error=google_failed`,
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
  },
);

// GET /api/auth/me - get current user info
router.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user.id).select("email");
    if (!user) {
      throw new AppError(404, "User not found", "USER_NOT_FOUND");
    }
    res.json({ email: user.email });
});

//post /api/auth/demo
router.post("/demo",  signupLimiter, async (req, res) => {
    let demoUser = await User.findOne({ email: "demo@studytracker.com" });
    if (!demoUser) {
      const hashedPassword = await bcrypt.hash("demo123", 10);
      demoUser = await User.create({
        email: "demo@studytracker.com",
        password: hashedPassword,
        isVerified: true,
      });
    }
    const token = jwt.sign({ id: demoUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token });
});

export default router;
