import React from "react";
import "./taskCardSkeleton.css";

function TaskCardSkeleton() {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div className="skeleton-content-wrapper">
            <div className="bg-secondary bg-opacity-25 rounded mb-2 skeleton-title" />
            <div className="d-flex gap-2">
              <div className="bg-secondary bg-opacity-25 rounded skeleton-badge-small" />
              <div className="bg-secondary bg-opacity-25 rounded skeleton-badge-medium" />
            </div>
          </div>
          <div className="d-flex gap-2">
            <div className="bg-secondary bg-opacity-25 rounded skeleton-button-small" />
            <div className="bg-secondary bg-opacity-25 rounded skeleton-button-small" />
            <div className="bg-secondary bg-opacity-25 rounded skeleton-button-medium" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCardSkeleton;
