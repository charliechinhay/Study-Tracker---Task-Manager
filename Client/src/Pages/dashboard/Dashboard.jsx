import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import TaskCard from "../../components/taskCard/TaskCard";
import TaskForm from "../../components/taskForm/TaskForm";
import EditTaskModal from "../../components/editTaskModal/EditTaskModal";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    apiRequest("tasks")
      .then(setTasks)
      .catch(() => setError("Failed to load tasks."))
      .finally(() => setLoading(false));

    apiRequest("auth/me")
      .then((data) => setUserEmail(data.email))
      .catch(() => {});
  }, []);

  const handleAdd = async (formData) => {
    try {
      const newTask = await apiRequest("tasks", {
        method: "POST",
        body: formData,
      });
      setTasks((prev) => [...prev, newTask]);
    } catch {
      setError("Failed to add task.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch {
      setError("Failed to delete task.");
    }
  };

  const handleToggle = async (task) => {
    try {
      const updated = await apiRequest(`tasks/${task._id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: !task.completed }),
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t)),
      );
    } catch {
      setError("Failed to update task.");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleEditSave = async ({ _id, formData }) => {
    try {
      const saved = await apiRequest(`tasks/${_id}`, {
        method: "PATCH",
        body: formData,
      });
      setTasks((prev) => prev.map((t) => (t._id === saved._id ? saved : t)));
      setEditingTask(null);
    } catch {
      setError("Failed to update task.");
    }
  };

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h2 className="fw-bold mb-0">My Tasks</h2>
          {userEmail && (
            <small className="text-muted">
              <i className="bi bi-person-circle me-1" />
              {userEmail}
            </small>
          )}
        </div>
        <span className="text-muted small fw-medium">
          {completedCount}/{totalCount} completed
        </span>
      </div>

      {totalCount > 0 && (
        <div className="progress progress-thin mb-4">
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible py-2 small">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          />
        </div>
      )}

      <TaskForm onAdd={handleAdd} />

      <div className="input-group mb-3">
        <span className="input-group-text bg-transparent">
          <i className="bi bi-search text-muted" />
        </span>
        <input
          type="text"
          className="form-control border-start-0"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="btn-group mb-4 w-100">
        <button
          className={`btn btn-outline-secondary ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({totalCount})
        </button>
        <button
          className={`btn btn-outline-secondary ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("active")}
        >
          Active ({tasks.filter((t) => !t.completed).length})
        </button>
        <button
          className={`btn btn-outline-secondary ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Done ({completedCount})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-muted mt-3 small">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: "2.5rem" }}>
            {search ? "🔍" : filter === "completed" ? "🎉" : "📋"}
          </div>
          <p className="text-muted mt-3">
            {search
              ? `No tasks found for "${search}"`
              : filter === "completed"
              ? "No completed tasks yet"
              : "No tasks here — add one above!"}
          </p>
        </div>
      ) : (
        filteredTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onEdit={handleEdit}
          />
        ))
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

export default Dashboard;
