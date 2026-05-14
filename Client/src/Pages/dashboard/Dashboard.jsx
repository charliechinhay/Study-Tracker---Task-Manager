import "./Dashboard.css";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import TaskCard from "../../components/taskCard/TaskCard";
import TaskForm from "../../components/taskForm/TaskForm";
import Statistics from "../../components/statistics/Statistics";
import EditTaskModal from "../../components/editTaskModal/EditTaskModal";
import TaskCardSkeleton from "../../components/taskCardSkeleton/TaskCardSkeleton";
import SortableTaskCard from "../../components/sortableTaskCard/SortableTaskCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showStats, setShowStats] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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
      toast.success("Task added!");
    } catch {
      toast.error("Failed to add task.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`tasks/${id}`, { method: "DELETE" });
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted!");
    } catch {
      toast.error("Failed to delete task.");
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
      toast.success("Task updated!");
    } catch {
      toast.error("Failed to update task.");
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
      toast.success("Task updated!");
    } catch {
      toast.error("Failed to update task.");
    }
  };

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .filter((t) => {
      if (categoryFilter === "all") return true;
      return t.category === categoryFilter;
    })
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="container-fluid px-2 px-sm-3">
      <div className="d-flex justify-content-between align-items-start align-items-sm-center mb-3 flex-column flex-sm-row gap-2">
        <div>
          <h2 className="fw-bold mb-2">My Tasks</h2>
          {userEmail && (
            <div className="text-muted small mb-2">
              <i className="bi bi-person-circle me-1" />
              {userEmail}
            </div>
          )}
          <button
            className={`btn btn-sm ${showStats ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setShowStats(!showStats)}
          >
            📊 {showStats ? "Hide" : "Show"} Stats
          </button>
        </div>
        <span className="text-muted small fw-medium align-self-start align-self-sm-auto ">
          {completedCount}/{totalCount} completed
        </span>
      </div>

      {totalCount > 0 && (
        <div className="progress progress-thin mb-4">
          <div
            className="progress-bar bg-success dashboard-progress-bar"
            role="progressbar"
            style={{
              "--progress-width": `${(completedCount / totalCount) * 100}%`,
            }}
            aria-valuenow={(completedCount / totalCount) * 100}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible py-2 small mb-4">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          />
        </div>
      )}

      {showStats && (
        <div className="mb-4">
          <Statistics tasks={tasks} />
        </div>
      )}

      <div className="row g-3 g-lg-4">
        <div className="col-12 col-lg-4">
          <div className="dashboard-form-sticky">
            <TaskForm onAdd={handleAdd} />
          </div>
        </div>

        <div className="col-12 col-lg-8">
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
          <div className="mb-3">
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="math">📐 Math</option>
              <option value="science">🔬 Science</option>
              <option value="language">🗣️ Language</option>
              <option value="history">📜 History</option>
              <option value="programming">💻 Programming</option>
              <option value="literature">📚 Literature</option>
              <option value="assignment">📝 Assignment</option>
              <option value="exam">📖 Exam</option>
              <option value="project">🎯 Project</option>
              <option value="other">🔷 Other</option>
            </select>
          </div>

          <div className="btn-group mb-4 w-100 d-flex">
            <button
              className={`btn btn-outline-secondary flex-fill ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              <span className="d-none d-sm-inline">All ({totalCount})</span>
              <span className="d-inline d-sm-none">All</span>
            </button>
            <button
              className={`btn btn-outline-secondary flex-fill ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              <span className="d-none d-sm-inline">
                Active ({tasks.filter((t) => !t.completed).length})
              </span>
              <span className="d-inline d-sm-none">Active</span>
            </button>
            <button
              className={`btn btn-outline-secondary flex-fill ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              <span className="d-none d-sm-inline">
                Done ({completedCount})
              </span>
              <span className="d-inline d-sm-none">Done</span>
            </button>
          </div>

          {loading ? (
            <>
              <TaskCardSkeleton />
              <TaskCardSkeleton />
              <TaskCardSkeleton />
            </>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-5">
              <div className="dashboard-empty-icon">
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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (active.id !== over.id) {
                  const oldIndex = filteredTasks.findIndex(
                    (t) => t._id === active.id,
                  );
                  const newIndex = filteredTasks.findIndex(
                    (t) => t._id === over.id,
                  );
                  const reordered = arrayMove(
                    filteredTasks,
                    oldIndex,
                    newIndex,
                  );

                  setTasks((prev) => {
                    const newOrder = reordered.map((t) => t._id);
                    const sorted = [...prev].sort((a, b) => {
                      return newOrder.indexOf(a._id) - newOrder.indexOf(b._id);
                    });
                    return sorted;
                  });

                  apiRequest("tasks", {
                    method: "PATCH",
                    body: JSON.stringify({
                      tasks: reordered.map((t) => ({ _id: t._id })),
                    }),
                  }).catch(() => {
                    toast.error("Failed to reorder tasks.");
                  });
                }
              }}
            >
              <SortableContext
                items={filteredTasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                {filteredTasks.map((task) => (
                  <SortableTaskCard
                    key={task._id}
                    task={task}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

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
