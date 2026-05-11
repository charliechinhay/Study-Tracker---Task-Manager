import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import "./taskDetail.css";

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
        <p className="text-muted mt-3 small">Loading task...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: "3rem" }}>😕</div>
        <p className="text-danger mt-3">{error}</p>
        <button
          className="btn btn-primary px-4"
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
      <div className="col-md-8 col-lg-7">
        <button
          className="btn btn-link text-muted ps-0 mb-3 d-flex align-items-center gap-1 text-decoration-none"
          onClick={() => navigate("/dashboard")}
        >
          <i className="bi bi-arrow-left" /> Back
        </button>

        <div className="card shadow-sm">
          {task.image?.url && (
            <img
              src={task.image.url}
              alt={task.title}
              className="card-img-top img-detail"
            />
          )}
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h2
                className={`fw-bold mb-0 ${
                  task.completed
                    ? "text-decoration-line-through text-muted"
                    : ""
                }`}
              >
                {task.title}
              </h2>
              <span
                className={`badge bg-${priorityBadge[task.priority]} ms-2`}
              >
                {task.priority}
              </span>
            </div>

            <div className="d-flex gap-2 mb-4 flex-wrap">
              <span
                className={`badge fs-6 ${
                  task.completed ? "bg-success" : "bg-secondary"
                }`}
              >
                {task.completed ? (
                  <>
                    <i className="bi bi-check-circle me-1" /> Completed
                  </>
                ) : (
                  <>
                    <i className="bi bi-clock me-1" /> Active
                  </>
                )}
              </span>
              {isOverdue && (
                <span className="badge bg-danger fs-6">
                  <i className="bi bi-exclamation-triangle me-1" /> Overdue
                </span>
              )}
            </div>

            <div className="list-group list-group-flush">
              {task.dueDate && (
                <div className="list-group-item px-0 d-flex justify-content-between">
                  <span className="text-muted fw-medium">Due date</span>
                  <span className={isOverdue ? "text-danger fw-medium" : ""}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted fw-medium">Created</span>
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="list-group-item px-0 d-flex justify-content-between">
                <span className="text-muted fw-medium">Last updated</span>
                <span>{new Date(task.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
