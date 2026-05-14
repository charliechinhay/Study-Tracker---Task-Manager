import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

const SECRET = "test-jwt-secret-key";

describe("auth middleware", () => {
  let req, res, next;

  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
    req = { headers: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  it("rejects request with no authorization header", () => {
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "No token, access denied" });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects request with malformed authorization header", () => {
    req.headers.authorization = "InvalidHeader";
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects request with invalid token", () => {
    req.headers.authorization = "Bearer invalidtoken123";
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token is not valid" });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and sets req.user for valid token", () => {
    const token = jwt.sign({ id: "user123" }, SECRET, { expiresIn: "1h" });
    req.headers.authorization = `Bearer ${token}`;
    auth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toMatchObject({ id: "user123" });
  });

  it("rejects expired token", () => {
    const token = jwt.sign({ id: "user123" }, SECRET, { expiresIn: "-1s" });
    req.headers.authorization = `Bearer ${token}`;
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
