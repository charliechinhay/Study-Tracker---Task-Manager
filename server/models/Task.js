import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    category: {
      type: String,
      enum: [
        "math",
        "science",
        "language",
        "history",
        "programming",
        "literature",
        "assignment",
        "exam",
        "project",
        "other",
      ],
      default: "other",
    },
    dueDate: { type: Date, default: null },
    image: {
      url: {
        type: String,
        default: null,
      },
      publicId: { type: String, default: null },
    },
    completed: { type: Boolean, default: false },

    order: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true },
);

export default mongoose.model("Task", taskSchema);
