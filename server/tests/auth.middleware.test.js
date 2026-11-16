import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";
import AppError from "../utils/AppError.js";

const SECRET = "test-jwt-secret-key";

const expectAuthError = (next,message) => {
  expect(next).toHaveBeenCalledTimes(1);
  const err = next.mock.calls[0][0];
  expect(err).toBeInstanceOf(AppError);
  expect(err.status).toBe(401);
  if(message) expect(err.message).toBe(message);
}



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
    expectAuthError(next, "No token, access denied");
    expect(res.status).not.toHaveBeenCalled();
  });

  it("rejects request with malformed authorization header", () => {
    req.headers.authorization = "InvalidHeader";
    auth(req, res, next);
    expectAuthError(next);
  });

    it("rejects a header without the space after Bearer", () => {
    const token = jwt.sign({ id: "user123" }, SECRET, { expiresIn: "1h" });
    req.headers.authorization = `Bearer${token}`;
    auth(req, res, next);
    expectAuthError(next, "No token, access denied");
  });


  it("rejects request with invalid token", () => {
    req.headers.authorization = "Bearer invalidtoken123";
    auth(req, res, next);
    expectAuthError(next, "Token is not valid");
  });

  it("calls next and sets req.user for valid token", () => {
    const token = jwt.sign({ id: "user123" }, SECRET, { expiresIn: "1h" });
    req.headers.authorization = `Bearer ${token}`;
    auth(req, res, next);
    expect(next).toHaveBeenCalledWith();
    expect(req.user).toMatchObject({ id: "user123" });
  });

  it("rejects expired token", () => {
    const token = jwt.sign({ id: "user123" }, SECRET, { expiresIn: "-1s" });
    req.headers.authorization = `Bearer ${token}`;
    auth(req, res, next);
    expectAuthError(next, "Token is not valid");
  });
});
