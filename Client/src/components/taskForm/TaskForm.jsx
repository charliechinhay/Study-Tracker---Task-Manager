import "./taskForm.css";
import { useRef, useState } from "react";
import { CATEGORIES, PRIORITIES } from "../../constants/tasks.js";

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("other");
  const [dueDate, setDueDate] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [description, setDescription] = useState("");
  const fileRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("priority", priority);
    formData.append("category", category);
    formData.append("description", description.trim());
    if (dueDate) formData.append("dueDate", dueDate);
    if (image) formData.append("image", image);

    onAdd(formData);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategory("other");
    setDueDate("");
    setImage(null);
    setPreview(null);
    setExpanded(false);
  };

  return (
    <div className="task-form-card">
      <form onSubmit={handleSubmit}>
        <div className="task-form-section">
          <div className="task-form-title-row mb-2">
            <input
              type="text"
              className="form-control task-form-title-input flex-grow-1"
              placeholder="Add a new task…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setExpanded(true)}
            />
            <button type="submit" className="btn btn-primary task-form-add-btn">
              <i className="bi bi-plus-lg" />
              <span className="ms-1 d-none d-sm-inline">Add</span>
            </button>
          </div>

          {expanded && (
            <textarea
              className="form-control task-form-desc"
              placeholder="Description (optional)…"
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          )}
        </div>

        {expanded && (
          <div className="task-form-expanded">
            <div className="task-form-row">
              <select
                className="form-select task-form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {PRIORITIES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                className="form-select task-form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="date"
                className="form-control task-form-date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <input
              ref={fileRef}
              type="file"
              className="d-none"
              onChange={handleImageChange}
              accept="image/*"
            />
            <label
              className="task-form-file-label"
              onClick={() => fileRef.current?.click()}
            >
              <i className="bi bi-image" />
              {image ? image.name : "Attach image (optional)"}
            </label>

            {preview && (
              <img src={preview} alt="Preview" className="task-form-preview" />
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default TaskForm;
