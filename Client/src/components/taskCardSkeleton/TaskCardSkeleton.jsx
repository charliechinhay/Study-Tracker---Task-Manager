import "./taskCardSkeleton.css";

function TaskCardSkeleton() {
  return (
    <div
      className="mb-2"
      style={{
        border: "1px solid var(--bs-border-color)",
        borderLeft: "3px solid var(--bs-secondary-bg)",
        borderRadius: "var(--radius-md)",
        padding: "0.625rem 0.75rem",
      }}
    >
      <div className="d-flex align-items-start gap-2">
        <div className="flex-grow-1 min-w-0">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="skeleton-pulse skeleton-title" />
            <div className="d-flex gap-1 ms-2 flex-shrink-0">
              <div className="skeleton-pulse skeleton-button-small" />
              <div className="skeleton-pulse skeleton-button-small" />
              <div className="skeleton-pulse skeleton-button-small" />
            </div>
          </div>
          <div className="d-flex gap-2">
            <div className="skeleton-pulse skeleton-badge-small" />
            <div className="skeleton-pulse skeleton-badge-medium" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCardSkeleton;
