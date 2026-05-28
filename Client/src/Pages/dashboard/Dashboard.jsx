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
import { AnimatePresence } from "framer-motion";
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
      const newTask = await apiRequest("tasks", { method: "POST", body: formData });
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
      toast.success("Task deleted.");
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
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      toast.success(updated.completed ? "Task completed!" : "Task reopened.");
    } catch {
      toast.error("Failed to update task.");
    }
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
    .filter((t) => categoryFilter === "all" || t.category === categoryFilter)
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const activeCount = totalCount - completedCount;

  return (
    <div>
      {/* Header */}
      <div className="dashboard-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h2 className="dashboard-title">My Tasks</h2>
          {userEmail && (
            <p className="dashboard-user-email text-muted">{userEmail}</p>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          {totalCount > 0 && (
            <span className="dashboard-count text-muted">
              {completedCount}/{totalCount} done
            </span>
          )}
          <button
            className={`stats-toggle-btn ${showStats ? "active" : ""}`}
            onClick={() => setShowStats(!showStats)}
          >
            <i className="bi bi-bar-chart" />
            <span className="d-none d-sm-inline">Stats</span>
          </button>
        </div>
      </div>

      {/* Progress */}
      {totalCount > 0 && (
        <div className="progress progress-thin mb-4">
          <div
            className="progress-bar bg-primary dashboard-progress-bar"
            role="progressbar"
            style={{ "--progress-width": `${(completedCount / totalCount) * 100}%` }}
            aria-valuenow={(completedCount / totalCount) * 100}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible py-2 small mb-3 dashboard-alert">
          {error}
          <button type="button" className="btn-close btn-close-sm" onClick={() => setError("")} />
        </div>
      )}

      {/* Stats panel */}
      {showStats && (
        <div className="mb-4">
          <Statistics tasks={tasks} />
        </div>
      )}

      <div className="row g-3 g-lg-4">
        {/* Left: form */}
        <div className="col-12 col-lg-4">
          <div className="dashboard-form-sticky">
            <TaskForm onAdd={handleAdd} />
          </div>
        </div>

        {/* Right: task list */}
        <div className="col-12 col-lg-8">
          {/* Search + category */}
          <div className="d-flex gap-2 mb-3 flex-column">
            <div className="dashboard-search-wrapper">
              <i className="bi bi-search dashboard-search-icon" />
              <input
                type="text"
                className="form-control dashboard-search w-100"
                placeholder="Search tasks…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="form-select dashboard-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All categories</option>
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

          {/* Filter tabs */}
          <div className="d-flex gap-2 mb-4 flex-wrap">
            {[
              { key: "all", label: `All (${totalCount})` },
              { key: "active", label: `Active (${activeCount})` },
              { key: "completed", label: `Done (${completedCount})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`dashboard-filter-tab ${filter === key ? "active" : ""}`}
                onClick={() => setFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Task list */}
          {loading ? (
            <>
              <TaskCardSkeleton />
              <TaskCardSkeleton />
              <TaskCardSkeleton />
            </>
          ) : filteredTasks.length === 0 ? (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon">
                {search ? "🔍" : filter === "completed" ? "🎉" : "📋"}
              </div>
              <p className="text-muted small mb-0">
                {search
                  ? `No tasks found for "${search}"`
                  : filter === "completed"
                    ? "No completed tasks yet"
                    : "No tasks yet — add one!"}
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (!over || active.id === over.id) return;
                const oldIndex = filteredTasks.findIndex((t) => t._id === active.id);
                const newIndex = filteredTasks.findIndex((t) => t._id === over.id);
                const reordered = arrayMove(filteredTasks, oldIndex, newIndex);

                setTasks((prev) => {
                  const newOrder = reordered.map((t) => t._id);
                  return [...prev].sort(
                    (a, b) => newOrder.indexOf(a._id) - newOrder.indexOf(b._id),
                  );
                });

                apiRequest("tasks", {
                  method: "PATCH",
                  body: JSON.stringify({ tasks: reordered.map((t) => ({ _id: t._id })) }),
                }).catch(() => toast.error("Failed to reorder tasks."));
              }}
            >
              <SortableContext
                items={filteredTasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence>
                  {filteredTasks.map((task) => (
                    <SortableTaskCard
                      key={task._id}
                      task={task}
                      onDelete={handleDelete}
                      onToggle={handleToggle}
                      onEdit={setEditingTask}
                    />
                  ))}
                </AnimatePresence>
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
