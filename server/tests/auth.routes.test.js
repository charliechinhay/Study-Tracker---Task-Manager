import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";

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
  default: {
    findOne: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../models/Task.js", () => ({
  default: {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
    findOneAndDelete: vi.fn(),
    bulkWrite: vi.fn(),
  },
}));

import app from "../app.js";
import User from "../models/User.js";

describe("POST /api/auth/register", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 when fields are missing", async () => {
    const res = await request(app).post("/api/auth/register").send({ email: "" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when email already in use", async () => {
    User.findOne.mockResolvedValueOnce({ _id: "existing", email: "test@example.com" });
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "password123" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email already in use");
  });

  it("creates user and returns 201", async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce({ _id: "new-id", email: "new@example.com" });
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "new@example.com", password: "password123" });
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/Account created/);
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 when fields are missing", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
  });

  it("returns 400 when user not found", async () => {
    User.findOne.mockResolvedValueOnce(null);
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "notfound@example.com", password: "pass" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("returns 400 for Google-only account", async () => {
    User.findOne.mockResolvedValueOnce({ email: "google@example.com", googleId: "g123", password: null });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "google@example.com", password: "pass" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for wrong password", async () => {
    const hashed = await bcrypt.hash("correctpass", 10);
    User.findOne.mockResolvedValueOnce({ email: "test@example.com", password: hashed, googleId: null });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "wrongpass" });
    expect(res.status).toBe(400);
  });

  it("returns token on successful login", async () => {
    const hashed = await bcrypt.hash("correctpass", 10);
    User.findOne.mockResolvedValueOnce({
      _id: "user-id",
      email: "test@example.com",
      password: hashed,
      googleId: null,
    });
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "correctpass" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});

describe("POST /api/auth/demo", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns a token for existing demo user", async () => {
    User.findOne.mockResolvedValueOnce({
      _id: "demo-id",
      email: "demo@studytracker.com",
      password: "hashed",
    });
    const res = await request(app).post("/api/auth/demo");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("creates demo user if not found and returns token", async () => {
    User.findOne.mockResolvedValueOnce(null);
    User.create.mockResolvedValueOnce({
      _id: "new-demo-id",
      email: "demo@studytracker.com",
    });
    const res = await request(app).post("/api/auth/demo");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
