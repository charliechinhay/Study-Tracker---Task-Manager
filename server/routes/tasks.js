import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import validateObjectId from "../middleware/validateObjectId.js";
import { upload } from "../config/cloudinary.js";
import cloudinary from "../config/cloudinary.js";
import AppError from "../utils/AppError.js";
import{
  createTaskSchema,
  updateTaskSchema,
  reorderTasksSchema
} from "../validation/taskSchemas.js";

const router = express.Router();
//express 5: no need for try-catch in async route handlers, errors will be passed to error handling middleware automatically (errorHandler)
//GET /api/tasks - get all user's tasks
router.get("/", auth, async (req, res) => {
    const tasks = await Task.find({ user: req.user.id }).sort({
      order: 1,
      createdAt: -1,
    });
    res.json(tasks);
});

//GET /api/tasks/:id - get one task
router.get("/:id", auth, validateObjectId, async (req, res) => {
 
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      throw new AppError(404, "Task not found", "TASK_NOT_FOUND");
    }
    res.json(task);
});

//POST / api / tasks - create a new task
router.post("/", auth, upload.single("image"),validate(createTaskSchema), async (req, res) => {
    const task = await Task.create({
      ...req.body,
      user: req.user.id,
      image: req.file
        ? { url: req.file.path, publicId: req.file.filename }
        : { url: null, publicId: null },
    });
    res.status(201).json(task);
});

// PATCH /api/tasks/:id - update a task
router.patch("/:id", auth, validateObjectId, upload.single("image"), validate(updateTaskSchema), async (req, res) => {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      throw new AppError(404, "Task not found", "TASK_NOT_FOUND");
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
});

// PATCH /api/tasks/ - reorder tasks
router.patch("/", auth, validate(reorderTasksSchema), async (req, res) => {
    const { tasks } = req.body;

    const bulkOps = tasks.map((task, index) => ({
      updateOne: {
        filter: { _id: task._id, user: req.user.id },
        update: { order: index },
      },
    }));

    await Task.bulkWrite(bulkOps);
    res.json({ message: "Tasks reordered" });
});

// DELETE /api/tasks/:id  - delete a task
router.delete("/:id", auth, validateObjectId, async (req, res) => {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      throw new AppError(404, "Task not found", "TASK_NOT_FOUND");
    }

    if (task.image.publicId) {
      await cloudinary.uploader.destroy(task.image.publicId);
    }

    res.json({ message: "Task deleted" });
});

export default router;
