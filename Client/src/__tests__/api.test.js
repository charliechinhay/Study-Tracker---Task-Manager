import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiRequest, BASE_URL } from "../services/api";

describe("apiRequest", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("makes a request to the correct URL", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: "test" }),
    });
    await apiRequest("tasks");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/tasks`,
      expect.any(Object),
    );
  });

  it("includes Authorization header when token exists in localStorage", async () => {
    localStorage.setItem("token", "my-test-token");
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });
    await apiRequest("tasks");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer my-test-token",
        }),
      }),
    );
  });

  it("strips leading slash from endpoint", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });
    await apiRequest("/tasks");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${BASE_URL}/tasks`,
      expect.any(Object),
    );
  });

  it("throws an error with the server message when response is not ok", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ message: "Bad request" }),
    });
    await expect(apiRequest("tasks")).rejects.toThrow("Bad request");
  });

  it("throws generic HTTP error when response body has no message", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({}),
    });
    await expect(apiRequest("tasks")).rejects.toThrow("HTTP error 500");
  });

  it("sends Content-Type json for non-FormData bodies", async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    });
    await apiRequest("tasks", { body: JSON.stringify({ title: "Test" }) });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });
});
