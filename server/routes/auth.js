import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "../config/passport.js";
import User from "../models/User.js";
import { sendWelcomeEmail } from "../config/resend.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// post / api/ auth/ register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
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
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// post / api/ auth/ login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if user registered with Google
    if (!user.password && user.googleId) {
      return res.status(400).json({
        message: "This account uses Google login. Please sign in with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: " Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
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
  try {
    const user = await User.findById(req.user.id).select("email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ email: user.email });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
