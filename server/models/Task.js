import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
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
  },
  { timestamps: true },
);

export default mongoose.model("Task", taskSchema);
