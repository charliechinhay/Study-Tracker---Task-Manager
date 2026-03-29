function TaskCard({ task, onDelete, onToggle }) {
  return (
    <div className={`card mb-2 ${task.completed ? "border-success" : ""}`}>
      <div className="card-body d-flex justify-content-between align-items-center">
        <span className={task.completed ? "text-decoration-line-through text-muted" : ""}>
          {task.title}
        </span>
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
  );
}

export default TaskCard;
