import "./taskForm.css";
import { useState } from "react";

function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [description, setDescription] = useState("");

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
    formData.append("description", description.trim());
    if (dueDate) formData.append("dueDate", dueDate);
    if (image) formData.append("image", image);

    onAdd(formData);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setImage(null);
    setPreview(null);
    setExpanded(false);
  };

  return (
    <div className="card mb-4 border-dashed task-form">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="d-flex gap-2 mb-2 flex-column flex-sm-row">
            <input
              type="text"
              className="form-control"
              placeholder="Add a new task..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setExpanded(true)}
            />
            <button type="submit" className="btn btn-primary px-4 fw-medium">
              <i className="bi bi-plus-lg me-1" />
              Add
            </button>
          </div>
          <textarea
            className="form-control mb-2"
            placeholder="Description (optional)..."
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {expanded && (
            <>
              <div className="d-flex gap-2 mb-2 flex-column flex-md-row task-form-controls">
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">🟢 Low Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="high">🔴 High Priority</option>
                </select>
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <input
                type="file"
                className="form-control form-control-sm"
                onChange={handleImageChange}
                accept="image/*"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 image-preview"
                />
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
