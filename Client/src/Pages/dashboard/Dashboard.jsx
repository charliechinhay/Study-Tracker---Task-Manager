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

  useEffect(() => {
    apiRequest("tasks")
      .then(setTasks)
      .catch(() => setError("Failed to load tasks."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (title, priority, dueDate) => {
    try {
      const newTask = await apiRequest("tasks", {
        method: "POST",
        body: JSON.stringify({ title, priority, dueDate }),
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

  const handleEdit = async (tasks) => {
    setEditingTask(tasks);
  };

  const handleEditSave = async (updatedTask) => {
    try {
      const saved = await apiRequest(`tasks/${updatedTask._id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedTask),
      });
      setTasks((prev) => prev.map((t) => (t._id === saved._id ? saved : t)));
      setEditingTask(null);
    } catch {
      setError("Failed to update task.");
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">My Tasks</h2>
        <span className="text-muted">
          {completedCount} / {totalCount} completed
        </span>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          />
        </div>
      )}

      <TaskForm onAdd={handleAdd} />

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
          Completed ({completedCount})
        </button>
      </div>
      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-muted">No tasks yet. Add one above!</p>
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
