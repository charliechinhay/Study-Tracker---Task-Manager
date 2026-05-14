import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";

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
  default: { uploader: { destroy: vi.fn().mockResolvedValue(undefined) } },
  upload: { single: () => (req, res, next) => next() },
}));

vi.mock("../config/resend.js", () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../models/User.js", () => ({
  default: { findOne: vi.fn(), findById: vi.fn(), create: vi.fn() },
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
import Task from "../models/Task.js";

const SECRET = "test-jwt-secret-key";
const USER_ID = "user-id-123";
let authToken;

beforeAll(() => {
  authToken = jwt.sign({ id: USER_ID }, SECRET, { expiresIn: "1h" });
});

beforeEach(() => vi.clearAllMocks());

describe("GET /api/tasks", () => {
  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(401);
  });

  it("returns tasks array with valid token", async () => {
    Task.find.mockReturnValueOnce({ sort: vi.fn().mockResolvedValue([]) });
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /api/tasks/:id", () => {
  it("returns 401 without token", async () => {
    const res = await request(app).get("/api/tasks/task-1");
    expect(res.status).toBe(401);
  });

  it("returns 404 when task not found", async () => {
    Task.findOne.mockResolvedValueOnce(null);
    const res = await request(app)
      .get("/api/tasks/nonexistentid")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  it("returns task when found", async () => {
    const task = { _id: "task-1", title: "Study React", user: USER_ID };
    Task.findOne.mockResolvedValueOnce(task);
    const res = await request(app)
      .get("/api/tasks/task-1")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Study React");
  });
});

describe("POST /api/tasks", () => {
  it("returns 401 without token", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "Task" });
    expect(res.status).toBe(401);
  });

  it("returns 400 when title is missing", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ description: "No title" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Title is required");
  });

  it("creates and returns new task with status 201", async () => {
    const newTask = { _id: "new-task", title: "Study React", user: USER_ID };
    Task.create.mockResolvedValueOnce(newTask);
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "Study React", priority: "high", category: "programming" });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Study React");
  });
});

describe("PATCH /api/tasks/:id", () => {
  it("returns 401 without token", async () => {
    const res = await request(app).patch("/api/tasks/task-1").send({ completed: true });
    expect(res.status).toBe(401);
  });

  it("returns 404 when task not found", async () => {
    Task.findOneAndUpdate.mockResolvedValueOnce(null);
    const res = await request(app)
      .patch("/api/tasks/nonexistent")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ completed: true });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  it("updates task and returns 200", async () => {
    const updatedTask = {
      _id: "task-1",
      title: "Updated Task",
      completed: true,
      user: USER_ID,
      image: { url: null, publicId: null },
      save: vi.fn().mockResolvedValue(undefined),
    };
    Task.findOneAndUpdate.mockResolvedValueOnce(updatedTask);
    const res = await request(app)
      .patch("/api/tasks/task-1")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("returns 401 without token", async () => {
    const res = await request(app).delete("/api/tasks/task-1");
    expect(res.status).toBe(401);
  });

  it("returns 404 when task not found", async () => {
    Task.findOneAndDelete.mockResolvedValueOnce(null);
    const res = await request(app)
      .delete("/api/tasks/nonexistent")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  it("deletes task and returns success message", async () => {
    Task.findOneAndDelete.mockResolvedValueOnce({
      _id: "task-1",
      image: { url: null, publicId: null },
    });
    const res = await request(app)
      .delete("/api/tasks/task-1")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task deleted");
  });
});
