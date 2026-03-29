import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import TaskCard from "../../components/taskCard/TaskCard";
import TaskForm from "../../components/taskForm/TaskForm";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("tasks")
      .then(setTasks)
      .catch(() => setError("Failed to load tasks."));
  }, []);

  const handleAdd = async (title) => {
    try {
      const newTask = await apiRequest("tasks", {
        method: "POST",
        body: JSON.stringify({ title }),
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
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch {
      setError("Failed to update task.");
    }
  };

  return (
    <div>
      <h2 className="mb-4">My Tasks</h2>
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
      {tasks.length === 0 ? (
        <p className="text-muted">No tasks yet. Add one above!</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        ))
      )}
    </div>
  );
}

export default Dashboard;
