import "./taskCard.css";
import { useNavigate } from "react-router-dom";

function TaskCard({ task, onDelete, onToggle, onEdit, dragHandleProps }) {
  const navigate = useNavigate();

  const priorityBadge = {
    low: "success",
    medium: "warning",
    high: "danger",
  };

  const categoryLabels = {
    math: "📐 Math",
    science: "🔬 Science",
    language: "🗣️ Language",
    history: "📜 History",
    programming: "💻 Programming",
    literature: "📚 Literature",
    assignment: "📝 Assignment",
    exam: "📖 Exam",
    project: "🎯 Project",
    other: "🔷 Other",
  };

  const hasDueDate = !!task.dueDate;
  const isNotCompleted = !task.completed;
  const isPastDue = new Date(task.dueDate) < new Date();
  const isOverdue = hasDueDate && isNotCompleted && isPastDue;

  return (
    <div
      className={`card mb-2 task-card ${
        task.completed
          ? "border-success border-opacity-50"
          : isOverdue
            ? "border-danger border-opacity-50"
            : ""
      }`}
    >
      {task.image?.url && (
        <img
          src={task.image.url}
          alt={task.title}
          className="card-img-top image-preview"
        />
      )}
      <div className="card-body py-3">
        <div className="d-flex justify-content-between align-items-start gap-2 flex-column flex-sm-row">
          {dragHandleProps && (
            <div
              {...dragHandleProps}
              className="drag-handle d-flex align-items-center me-2"
              style={{ cursor: "grab" }}
              title="Drag to reorder"
            >
              <i className="bi bi-grip-vertical text-muted" />
            </div>
          )}
          <div className="flex-grow-1 w-100">
            <p
              className={`mb-1 fw-medium ${
                task.completed ? "text-decoration-line-through text-muted" : ""
              }`}
            >
              {task.title}
            </p>
            {task.description && (
              <p className="text-muted small mb-2 mt-1">
                {task.description.length > 60
                  ? `${task.description.substring(0, 60)}...`
                  : task.description}
              </p>
            )}
            <div className="d-flex gap-2 flex-wrap">
              <span className={`badge bg-${priorityBadge[task.priority]}`}>
                {task.priority}
              </span>
              <span className="badge bg-info">
                {categoryLabels[task.category]}
              </span>
              {task.dueDate && (
                <span
                  className={`badge ${isOverdue ? "bg-danger" : "bg-secondary"}`}
                >
                  <i className="bi bi-calendar3 me-1" />
                  <span className="d-none d-sm-inline">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span className="d-inline d-sm-none">
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {isOverdue && (
                    <span className="d-none d-sm-inline"> · Overdue</span>
                  )}
                </span>
              )}
              {task.completed && (
                <span className="badge bg-success bg-opacity-75">
                  <i className="bi bi-check-circle me-1" />
                  Done
                </span>
              )}
            </div>
          </div>
          <div className="d-flex gap-1 flex-shrink-0 align-self-end align-self-sm-start task-card-actions">
            <button
              className="btn btn-sm btn-outline-secondary"
              title="View details"
              onClick={() => navigate(`/tasks/${task._id}`)}
            >
              <i className="bi bi-eye" />
            </button>
            <button
              className={`btn btn-sm ${
                task.completed ? "btn-outline-secondary" : "btn-outline-success"
              }`}
              title={task.completed ? "Mark as active" : "Mark as done"}
              onClick={() => onToggle(task)}
            >
              <i
                className={`bi bi-${
                  task.completed ? "arrow-counterclockwise" : "check-lg"
                }`}
              />
            </button>
            <button
              className="btn btn-sm btn-outline-primary"
              title="Edit task"
              onClick={() => onEdit(task)}
            >
              <i className="bi bi-pencil" />
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              title="Delete task"
              onClick={() => onDelete(task._id)}
            >
              <i className="bi bi-trash" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
