import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";

// Each test file has its own instance of the app, so rate limit counters
// start from zero and do not interfere with other tests
vi.mock("../config/passport.js", () => ({
  default: {
    initialize: () => (req, res, next) => next(),
    session: () => (req, res, next) => next(),
    authenticate: () => (req, res, next) => next(),
    use: vi.fn(),
    serializeUser: vi.fn(),
    deserializeUser: vi.fn(),
  },
}));

vi.mock("../config/cloudinary.js", () => ({
  default: { uploader: { destroy: vi.fn() } },
  upload: { single: () => (req, res, next) => next() },
}));

vi.mock("../config/resend.js", () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../models/User.js", () => ({
  default: { findOne: vi.fn(), findById: vi.fn(), create: vi.fn() },
}));

vi.mock("../models/Task.js", () => ({
  default: { find: vi.fn(), findOne: vi.fn() },
}));

import app from "../app.js";
import User from "../models/User.js";

const login = (ip, password = "wrong") =>
  request(app)
    .post("/api/auth/login")
    .set("X-Forwarded-For", ip)
    .send({ email: "test@example.com", password });

describe("Rate limiting", () => {
  beforeEach(() => vi.clearAllMocks());

  it("blocks login after 10 failed attempts from the same IP", async () => {
    User.findOne.mockResolvedValue(null);

    for (let i = 0; i < 10; i++) {
      const res = await login("10.0.0.1");
      expect(res.status).toBe(400);
    }

    const res = await login("10.0.0.1");
    expect(res.status).toBe(429);
    expect(res.body).toEqual({
      message: "Too many attempts, please try again later",
      code: "TOO_MANY_REQUESTS",
    });
  });

  it("counts attempts separately for each IP", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await login("10.0.0.2");
    expect(res.status).toBe(400);
  });

  it("does not count successful logins", async () => {
    const hashed = await bcrypt.hash("correctpass", 4);
    User.findOne.mockResolvedValue({
      _id: "user-id",
      email: "test@example.com",
      password: hashed,
      googleId: null,
    });

    for (let i = 0; i < 12; i++) {
      const res = await login("10.0.0.3", "correctpass");
      expect(res.status).toBe(200);
    }
  });
});

describe("Security headers", () => {
  it("sets helmet headers on API responses", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });
});