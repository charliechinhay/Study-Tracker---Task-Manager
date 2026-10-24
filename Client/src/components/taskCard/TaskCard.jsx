import "./taskCard.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CATEGORY_LABELS } from "../../constants/tasks.js";

function TaskCard({ task, onDelete, onToggle, onEdit, dragHandleProps }) {
  const navigate = useNavigate();

  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  const hasImage = !!task.image?.url;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.2 } }}
      transition={{ duration: 0.25 }}
      className="mb-2"
    >
      {hasImage && (
        <img
          src={task.image.url}
          alt={task.title}
          className="task-card-image"
        />
      )}
      <div
        className={`task-card ${hasImage ? "has-image" : ""} ${task.completed ? "is-completed" : ""} priority-${task.priority}`}
      >
        <div className="card-body py-2 px-3">
          <div className="d-flex align-items-start gap-2">
            {dragHandleProps && (
              <div
                {...dragHandleProps}
                className="drag-handle mt-1"
                title="Drag to reorder"
              >
                <i className="bi bi-grip-vertical" />
              </div>
            )}

            <div className="flex-grow-1 min-w-0">
              <div className="d-flex align-items-start justify-content-between gap-2">
                <p
                  className={`task-title ${
                    task.completed
                      ? "text-decoration-line-through text-muted"
                      : ""
                  }`}
                >
                  {task.title}
                </p>

                <div className="task-actions">
                  <button
                    className="task-action-btn"
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    title="View details"
                  >
                    <i className="bi bi-arrow-up-right" />
                  </button>
                  <button
                    className={`task-action-btn ${
                      task.completed ? "btn-toggle-undo" : "btn-toggle-done"
                    }`}
                    onClick={() => onToggle(task)}
                    title={task.completed ? "Mark as active" : "Mark as done"}
                  >
                    <i
                      className={`bi bi-${task.completed ? "arrow-counterclockwise" : "check2"}`}
                    />
                  </button>
                  <button
                    className="task-action-btn"
                    onClick={() => onEdit(task)}
                    title="Edit task"
                  >
                    <i className="bi bi-pencil" />
                  </button>
                  <button
                    className="task-action-btn btn-delete"
                    onClick={() => onDelete(task._id)}
                    title="Delete task"
                  >
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </div>

              {task.description && (
                <p className="task-description text-muted">
                  {task.description}
                </p>
              )}

              <div className="task-badges">
                <span
                  className={`task-badge task-badge-priority-${task.priority}`}
                >
                  {task.priority}
                </span>
                <span className="task-badge task-badge-category">
                  {CATEGORY_LABELS[task.category]}
                </span>
                {task.dueDate && (
                  <span
                    className={`task-badge ${isOverdue ? "task-badge-overdue" : "task-badge-date"}`}
                  >
                    <i className="bi bi-calendar3" />
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    {isOverdue && " · overdue"}
                  </span>
                )}
                {task.completed && (
                  <span className="task-badge task-badge-done">
                    <i className="bi bi-check2" /> done
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TaskCard;
