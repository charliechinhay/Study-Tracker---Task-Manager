import "./taskDetail.css";
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import TaskDetailSkeleton from "../../components/taskDetailSkeleton/TaskDetailSkeleton";

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

  if (loading) return <TaskDetailSkeleton />;

  if (error || !task) {
    return (
      <div className="text-center py-5">
        <div className="icon-error-face mb-3">😕</div>
        <p className="text-muted small mb-3">{error}</p>
        <button
          className="btn btn-primary px-4 detail-error-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const isOverdue =
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-7">
        <button
          className="btn btn-link text-muted ps-0 mb-3 d-flex align-items-center gap-1 text-decoration-none small detail-back-btn"
          onClick={() => navigate("/dashboard")}
        >
          <i className="bi bi-arrow-left" />
          Back
        </button>

        <div className="task-detail-card card">
          {task.image?.url && (
            <img src={task.image.url} alt={task.title} className="img-detail" />
          )}

          <div className="card-body p-4">
            <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
              <h1
                className={`task-detail-title fw-bold mb-0 ${
                  task.completed ? "text-decoration-line-through text-muted" : ""
                }`}
              >
                {task.title}
              </h1>
            </div>

            {/* Status badges */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className={`detail-badge ${task.completed ? "detail-badge-done" : "detail-badge-active"}`}>
                <i className={`bi bi-${task.completed ? "check2-circle" : "clock"}`} />
                {task.completed ? "Completed" : "Active"}
              </span>
              <span className="detail-badge detail-badge-category">
                {categoryLabels[task.category]}
              </span>
              {isOverdue && (
                <span className="detail-badge detail-badge-overdue">
                  <i className="bi bi-exclamation-triangle" />
                  Overdue
                </span>
              )}
            </div>

            {task.description && (
              <div className="mb-4">
                <p className="detail-section-label text-muted fw-medium">Description</p>
                <p className="detail-description">{task.description}</p>
              </div>
            )}

            {/* Meta */}
            <div>
              <p className="detail-section-label text-muted fw-medium">Details</p>
              <div className="detail-meta-container">
                {task.dueDate && (
                  <div className="detail-meta-row">
                    <span className="detail-meta-key text-muted">Due date</span>
                    <span className={`detail-meta-value ${isOverdue ? "text-danger" : ""}`}>
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        weekday: "short", month: "short", day: "numeric", year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <div className="detail-meta-row">
                  <span className="detail-meta-key text-muted">Priority</span>
                  <span className="detail-meta-value detail-meta-value-capitalize">
                    {task.priority}
                  </span>
                </div>
                <div className="detail-meta-row">
                  <span className="detail-meta-key text-muted">Created</span>
                  <span className="detail-meta-value">
                    {new Date(task.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </span>
                </div>
                <div className="detail-meta-row">
                  <span className="detail-meta-key text-muted">Last updated</span>
                  <span className="detail-meta-value">
                    {new Date(task.updatedAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
