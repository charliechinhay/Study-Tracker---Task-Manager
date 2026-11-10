import { describe, it, expect, vi, beforeEach } from "vitest";

// Finto SDK Cloudinary: verifichiamo il NOSTRO codice (forma del risultato e gestione errori)
const { uploader } = vi.hoisted(() => ({
  uploader: { upload_stream: vi.fn(), destroy: vi.fn() },
}));
vi.mock("cloudinary", () => ({ v2: { config: vi.fn(), uploader } }));

import { uploadImage, deleteImage } from "../config/cloudinary.js";

describe("cloudinary helpers", () => {
  beforeEach(() => vi.clearAllMocks());

  it("uploadImage returns url and publicId (the shape saved in Task.image)", async () => {
    uploader.upload_stream.mockImplementation((options, callback) => ({
      end: () => callback(null, {
        secure_url: "https://res.cloudinary.com/x.png",
        public_id: "study-tracker/x",
      }),
    }));

    const image = await uploadImage({ buffer: Buffer.from("img") });

    expect(image).toEqual({ url: "https://res.cloudinary.com/x.png", publicId: "study-tracker/x" });
  });

  it("uploadImage rejects when Cloudinary fails", async () => {
    uploader.upload_stream.mockImplementation((options, callback) => ({
      end: () => callback(new Error("cloudinary down")),
    }));

    await expect(uploadImage({ buffer: Buffer.from("img") })).rejects.toThrow("cloudinary down");
  });

  it("deleteImage destroys the image by publicId", async () => {
    await deleteImage("study-tracker/x");
    expect(uploader.destroy).toHaveBeenCalledWith("study-tracker/x");
  });

  it("deleteImage does nothing without a publicId", async () => {
    await deleteImage(null);
    expect(uploader.destroy).not.toHaveBeenCalled();
  });

  it("deleteImage never throws (best effort, logs the error)", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    uploader.destroy.mockRejectedValueOnce(new Error("cloudinary down"));

    await expect(deleteImage("study-tracker/x")).resolves.toBeUndefined();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
