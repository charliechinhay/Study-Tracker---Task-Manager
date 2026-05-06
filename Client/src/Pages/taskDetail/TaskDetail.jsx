import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest(`tasks/${id}`)
      .then(setTask)
      .catch(() => setError("Task not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const priorityBadge = {
    low: "success",
    medium: "warning",
    high: "danger",
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">{error}</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const hasDueDate = !!task.dueDate;
  const isNotCompleted = !task.completed;
  const isPastDue = new Date(task.dueDate) < new Date();

  const isOverdue = hasDueDate && isNotCompleted && isPastDue;

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <h2
                className={
                  task.completed
                    ? "text-decoration-line-through text-muted"
                    : ""
                }
              >
                {task.title}
              </h2>
              <span className={`badge bg-${priorityBadge[task.priority]} fs-6`}>
                {task.priority}
              </span>
            </div>

            <div className="mb-3">
              <span
                className={`badge fs-6 ${task.completed ? "bg-success" : "bg-secondary"}`}
              >
                {task.completed ? "✅ Completed" : "⏳ Active"}
              </span>
            </div>

            {task.dueDate && (
              <div className="mb-3">
                <strong>Due Date:</strong>{" "}
                <span className={isOverdue ? "text-danger" : ""}>
                  {new Date(task.dueDate).toLocaleDateString()}
                  {isOverdue && " ⚠️ Overdue"}
                </span>
              </div>
            )}

            <div className="mb-3">
              <strong>Created:</strong>{" "}
              {new Date(task.createdAt).toLocaleDateString()}
            </div>

            <div className="mb-3">
              <strong>Last updated:</strong>{" "}
              {new Date(task.updatedAt).toLocaleDateString()}
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/dashboard")}
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
