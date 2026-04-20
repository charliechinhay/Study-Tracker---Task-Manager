function TaskCard({ task, onDelete, onToggle }) {
  const priorityBadge = {
    low: "success",
    medium: "warning",
    high: "danger",
  };

  const hasDueDate = !!task.dueDate;
  const isNotCompleted = !task.completed;
  const isPastDue = new Date(task.dueDate) < new Date();

  const isOverdue = hasDueDate && isNotCompleted && isPastDue;

  return (
    <div
      className={`card mb-2 ${task.completed ? "border-success" : isOverdue ? "border-danger" : ""}`}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span
              className={
                task.completed ? "text-decoration-line-through text-muted" : ""
              }
            >
              {task.title}
            </span>
            <div className="d-flex gap-2 mt-1">
              <span className={`badge bg-${priorityBadge[task.priority]}`}>
                {task.priority}
              </span>
              {task.dueDate && (
                <span
                  className={`badge ${isOverdue ? "bg-danger" : "bg-secondary"}`}
                >
                  📅 {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm ${task.completed ? "btn-outline-secondary" : "btn-outline-success"}`}
              onClick={() => onToggle(task)}
            >
              {task.completed ? "Undo" : "Done"}
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
