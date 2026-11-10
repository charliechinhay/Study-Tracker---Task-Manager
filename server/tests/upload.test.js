import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import { upload } from "../middleware/upload.js";
import { errorHandler } from "../middleware/errorHandler.js";

// Mini app con il vero middleware multer: verifica i limiti senza Cloudinary né database
const app = express();
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({ size: req.file?.size ?? 0 });
});
app.use(errorHandler);

const MB = 1024 * 1024;

const send = (buffer, filename, contentType) =>
  request(app).post("/upload").attach("image", buffer, { filename, contentType });

describe("upload middleware", () => {
  it("accepts a PNG under 2 MB", async () => {
    const res = await send(Buffer.alloc(100 * 1024), "photo.png", "image/png");
    expect(res.status).toBe(200);
    expect(res.body.size).toBe(100 * 1024);
  });

  it("rejects images larger than 2 MB with 413", async () => {
    const res = await send(Buffer.alloc(3 * MB), "big.jpg", "image/jpeg");
    expect(res.status).toBe(413);
    expect(res.body).toEqual({
      message: "Image must be at most 2 MB",
      code: "FILE_TOO_LARGE",
    });
  });

  it("rejects files that are not JPG, PNG or WEBP", async () => {
    const res = await send(Buffer.from("%PDF-1.4"), "doc.pdf", "application/pdf");
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("INVALID_FILE_TYPE");
  });

  it("rejects more than one file", async () => {
    const res = await request(app)
      .post("/upload")
      .attach("image", Buffer.alloc(10), { filename: "a.png", contentType: "image/png" })
      .attach("image", Buffer.alloc(10), { filename: "b.png", contentType: "image/png" });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe("UPLOAD_ERROR");
  });
});