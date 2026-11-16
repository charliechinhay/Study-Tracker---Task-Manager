import { describe, it, expect } from "vitest";
import { checkEnv } from "../config/env.js";

const VALID_ENV = {
  MONGO_URI: "mongodb://localhost/test",
  JWT_SECRET: "a".repeat(32),
  CLIENT_URL: "http://localhost:5173",
  GOOGLE_CLIENT_ID: "google-id",
  GOOGLE_CLIENT_SECRET: "google-secret",
  CLOUDINARY_CLOUD_NAME: "cloud",
  CLOUDINARY_API_KEY: "key",
  CLOUDINARY_API_SECRET: "secret",
  RESEND_API_KEY: "resend-key",
};

describe("checkEnv", () => {
  it("accepts a complete environment", () => {
    expect(checkEnv(VALID_ENV)).toEqual({ missing: [], warnings: [] });
  });

  it("lists missing or empty variables by name only", () => {
    const { missing } = checkEnv({ ...VALID_ENV, JWT_SECRET: undefined, MONGO_URI: "   " });
    expect(missing).toEqual(["MONGO_URI", "JWT_SECRET"]);
  });

  it("never includes secret values in the result", () => {
    const env = { ...VALID_ENV, NODE_ENV: "production", JWT_SECRET: "short-secret" };
    const result = JSON.stringify(checkEnv(env));
    expect(result).not.toContain("short-secret");
    expect(result).not.toContain("google-secret");
  });

  it("requires GOOGLE_CALLBACK_URL only in production", () => {
    expect(checkEnv(VALID_ENV).missing).toEqual([]);
    expect(checkEnv({ ...VALID_ENV, NODE_ENV: "production" }).missing).toEqual(["GOOGLE_CALLBACK_URL"]);
  });

  it("warns about a short JWT_SECRET in production", () => {
    const env = {
      ...VALID_ENV,
      NODE_ENV: "production",
      GOOGLE_CALLBACK_URL: "https://api.example.com/api/auth/google/callback",
      JWT_SECRET: "short",
    };
    expect(checkEnv(env)).toEqual({
      missing: [],
      warnings: ["JWT_SECRET should be at least 32 characters long"],
    });
  });
});