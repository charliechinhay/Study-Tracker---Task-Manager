import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import validateObjectId from "../middleware/validateObjectId.js";
import { upload } from "../config/cloudinary.js";
import cloudinary from "../config/cloudinary.js";
import{
  createTaskSchema,
  updateTaskSchema,
  reorderTasksSchema
} from "../validation/taskSchemas.js";

const router = express.Router();

//GET /api/tasks - get all user's tasks
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      order: 1,
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//GET /api/tasks/:id - get one task
router.get("/:id", auth, validateObjectId, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//POST / api / tasks - create a new task
router.post("/", auth, upload.single("image"),validate(createTaskSchema), async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.id,
      image: req.file
        ? { url: req.file.path, publicId: req.file.filename }
        : { url: null, publicId: null },
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/tasks/:id - update a task
router.patch("/:id", auth, validateObjectId, upload.single("image"), validate(updateTaskSchema), async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
  
    //req.body contiene solo i campi validati e già convertiti grazie a validate middleware

    Object.assign(task, req.body);

    if (req.file) {
      if (task.image.publicId) {
        await cloudinary.uploader.destroy(task.image.publicId);
      }
      task.image = { url: req.file.path, publicId: req.file.filename };
    }

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/tasks/ - reorder tasks
router.patch("/", auth, validate(reorderTasksSchema), async (req, res) => {
  try {
    const { tasks } = req.body;

    const bulkOps = tasks.map((task, index) => ({
      updateOne: {
        filter: { _id: task._id, user: req.user.id },
        update: { order: index },
      },
    }));

    await Task.bulkWrite(bulkOps);
    res.json({ message: "Tasks reordered" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/tasks/:id  - delete a task
router.delete("/:id", auth, validateObjectId, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.image.publicId) {
      await cloudinary.uploader.destroy(task.image.publicId);
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
