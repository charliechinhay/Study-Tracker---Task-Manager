import "./editTaskModal.css";
import { useRef, useState } from "react";

function EditTaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const [description, setDescription] = useState(task.description || "");
  const [category, setCategory] = useState(task.category || "other");
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
  );
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(task.image?.url || null);
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
    onSave({ _id: task._id, formData });
  };

  return (
    <div className="modal d-block" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-edit-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content rounded-4">
          <div className="modal-header border-0 pb-0">
            <h6 className="modal-title fw-semibold">Edit Task</h6>
            <button className="btn-close btn-close-sm" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body pt-3">
              <div className="mb-3">
                <label className="modal-form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="mb-3">
                <label className="modal-form-label">Description</label>
                <textarea
                  className="form-control modal-textarea-noresize"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional…"
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="modal-form-label">Priority</label>
                  <select
                    className="form-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="modal-form-label">Due date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="modal-form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
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

              <div>
                <label className="modal-form-label">Image</label>
                <input
                  ref={fileRef}
                  type="file"
                  className="d-none"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary w-100 modal-img-btn"
                  onClick={() => fileRef.current?.click()}
                >
                  <i className="bi bi-image me-1" />
                  {image ? image.name : "Choose image"}
                </button>
                {preview && (
                  <img src={preview} alt="Preview" className="img-preview" />
                )}
              </div>
            </div>

            <div className="modal-footer border-0 pt-0 gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm px-3 modal-footer-btn"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm px-4 fw-medium modal-footer-btn"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditTaskModal;