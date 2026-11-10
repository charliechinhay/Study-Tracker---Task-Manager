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
  uploadImage: vi.fn(),
  deleteImage: vi.fn(),
}));

// Simula multer: con l'header "x-test-image" la richiesta ha un file in memoria
vi.mock("../middleware/upload.js", () => ({
  upload: {
    single: () => (req, res, next) => {
      if (req.headers["x-test-image"]) {
        req.file = { buffer: Buffer.from("fake-image"), mimetype: "image/png" };
      }
      next();
    },
  },
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
const USER_ID = "64b7f0c2a1b2c3d4e5f60001";
const OTHER_USER_ID = "64b7f0c2a1b2c3d4e5f60002";
const TASK_ID = "64b7f0c2a1b2c3d4e5f6a001";
const MISSING_ID = "64b7f0c2a1b2c3d4e5f6ffff";
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
    const res = await request(app).get(`/api/tasks/${TASK_ID}`);
    expect(res.status).toBe(401);
  });

  it("returns 404 when task not found", async () => {
    Task.findOne.mockResolvedValueOnce(null);
    const res = await request(app)
      .get(`/api/tasks/${MISSING_ID}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  it("returns task when found", async () => {
    const task = { _id: TASK_ID, title: "Study React", user: USER_ID };
    Task.findOne.mockResolvedValueOnce(task);
    const res = await request(app)
      .get(`/api/tasks/${TASK_ID}`)
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
    const newTask = { _id: TASK_ID, title: "Study React", user: USER_ID };
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
    const res = await request(app).patch(`/api/tasks/${TASK_ID}`).send({ completed: true });
    expect(res.status).toBe(401);
  });

  it("returns 404 when task not found", async () => {
    Task.findOne.mockResolvedValueOnce(null);
    const res = await request(app)
      .patch(`/api/tasks/${MISSING_ID}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ completed: true });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  it("updates task and returns 200", async () => {
    const updatedTask = {
      _id: TASK_ID,
      title: "Updated Task",
      completed: true,
      user: USER_ID,
      image: { url: null, publicId: null },
      save: vi.fn().mockResolvedValue(undefined),
    };
    Task.findOne.mockResolvedValueOnce(updatedTask);
    const res = await request(app)
      .patch(`/api/tasks/${TASK_ID}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("returns 401 without token", async () => {
    const res = await request(app).delete(`/api/tasks/${TASK_ID}`);
    expect(res.status).toBe(401);
  });

  it("returns 404 when task not found", async () => {
    Task.findOneAndDelete.mockResolvedValueOnce(null);
    const res = await request(app)
      .delete(`/api/tasks/${MISSING_ID}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  it("deletes task and returns success message", async () => {
    Task.findOneAndDelete.mockResolvedValueOnce({
      _id: TASK_ID,
      image: { url: null, publicId: null },
    });
    const res = await request(app)
      .delete(`/api/tasks/${TASK_ID}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Task deleted");
  });
});


describe("Validation and Security", () => {
  const auth = () => ({ Authorization: `Bearer ${authToken}` });

  it("ignore non-allowed fields (mass assignment) nel PATCH", async () => {
    const task = {
      _id: TASK_ID,
      title: "Old",
      user: USER_ID,
      image: { url: null, publicId: null },
      save: vi.fn().mockResolvedValue(undefined),
    };
    Task.findOne.mockResolvedValueOnce(task);

    const res = await request(app)
      .patch(`/api/tasks/${TASK_ID}`)
      .set(auth())
      .send({
        title: "New",
        user: OTHER_USER_ID,
        image: { url: "https://evil.example/x.png", publicId: "victim/img" },
      });

    expect(res.status).toBe(200);
    expect(task.title).toBe("New");
    expect(task.user).toBe(USER_ID);
    expect(task.image).toEqual({ url: null, publicId: null });
  });

  it("always filters task by authenticated user", async () => {
    Task.findOne.mockResolvedValueOnce(null);
    const res = await request(app).get(`/api/tasks/${TASK_ID}`).set(auth());

    expect(res.status).toBe(404);
    expect(Task.findOne).toHaveBeenCalledWith({ _id: TASK_ID, user: USER_ID });
  });

  it("converts completed from string (FormData) to boolean", async () => {
    const task = {
      _id: TASK_ID,
      user: USER_ID,
      completed: false,
      image: { url: null, publicId: null },
      save: vi.fn().mockResolvedValue(undefined),
    };
    Task.findOne.mockResolvedValueOnce(task);

    const res = await request(app)
      .patch(`/api/tasks/${TASK_ID}`)
      .set(auth())
      .send({ completed: "true" });

    expect(res.status).toBe(200);
    expect(task.completed).toBe(true);
  });

  it.each([
    ["get", `/api/tasks/not-an-id`],
    ["patch", `/api/tasks/not-an-id`],
    ["delete", `/api/tasks/not-an-id`],
  ])("responds 400 to %s with invalid ID", async (method, url) => {
    const res = await request(app)[method](url).set(auth()).send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid task id");
  });

  it.each([
    [{ title: "" }, "Title is required"],
    [{ title: "   " }, "Title is required"],
    [{ title: "a".repeat(201) }, "Title must be at most 200 characters"],
    [{ title: "Ok", priority: "urgent" }, undefined],
    [{ title: "Ok", category: "cooking" }, undefined],
    [{ title: "Ok", dueDate: "not-a-date" }, "Invalid due date"],
  ])("responds 400 to POST with invalid body: %j", async (body, message) => {
    const res = await request(app).post("/api/tasks").set(auth()).send(body);

    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errors)).toBe(true);
    if (message) expect(res.body.message).toBe(message);
    expect(Task.create).not.toHaveBeenCalled();
  });

  it("does not save user from body in POST", async () => {
    Task.create.mockResolvedValueOnce({ _id: TASK_ID, title: "T" });
    await request(app)
      .post("/api/tasks")
      .set(auth())
      .send({ title: "T", user: OTHER_USER_ID });

    expect(Task.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: "T", user: USER_ID }),
    );
  });

  it.each([
    [{}],
    [{ tasks: "x" }],
    [{ tasks: [] }],
    [{ tasks: [{ _id: "not-an-id" }] }],
  ])("responds 400 to reorder with invalid body: %j", async (body) => {
    const res = await request(app).patch("/api/tasks").set(auth()).send(body);
    expect(res.status).toBe(400);
    expect(Task.bulkWrite).not.toHaveBeenCalled();
  });

  it("reorder updates only tasks of authenticated user", async () => {
    Task.bulkWrite.mockResolvedValueOnce({});
    const res = await request(app)
      .patch("/api/tasks")
      .set(auth())
      .send({ tasks: [{ _id: TASK_ID }] });

    expect(res.status).toBe(200);
    expect(Task.bulkWrite).toHaveBeenCalledWith([
      {
        updateOne: {
          filter: { _id: TASK_ID, user: USER_ID },
          update: { order: 0 },
        },
      },
    ]);
  });

  describe("Error handling", () => {
  const auth = () => ({ Authorization: `Bearer ${authToken}` });

  it("responds 404 in JSON for unknown routes", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Route not found", code: "NOT_FOUND" });
  });
  });

    it("responds 400 for malformed JSON body", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set(auth())
      .set("Content-Type", "application/json")
      .send('{"title":');
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("INVALID_JSON");
  });

  it("responds 403 for origins not allowed by CORS", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Origin", "https://evil.example.com");
    expect(res.status).toBe(403);
    expect(res.body.code).toBe("CORS_NOT_ALLOWED");
  });

  it("lets allowed origins through CORS", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Origin", "http://localhost:5173");
    expect(res.status).toBe(401);
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });

  it("returns validation errors with code and field list", async () => {
    const res = await request(app).post("/api/tasks").set(auth()).send({});
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("VALIDATION_ERROR");
    expect(res.body.errors[0]).toMatchObject({ field: "title" });
  });

  it("hides internal error details from the client", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    Task.find.mockReturnValueOnce({
      sort: vi.fn().mockRejectedValueOnce(new Error("secret db detail")),
    });

    const res = await request(app).get("/api/tasks").set(auth());

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: "Server error", code: "INTERNAL_ERROR" });
    expect(JSON.stringify(res.body)).not.toContain("secret");
    spy.mockRestore();
  });

});
