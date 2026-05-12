import React from "react";
import "./taskDetailSkeleton.css";

function TaskDetailSkeleton() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div className="bg-secondary bg-opacity-25 rounded skeleton-detail-title" />
              <div className="bg-secondary bg-opacity-25 rounded skeleton-detail-badge" />
            </div>
            <div className="bg-secondary bg-opacity-25 rounded mb-3 skeleton-detail-status" />
            <div className="bg-secondary bg-opacity-25 rounded mb-3 skeleton-detail-info-large" />
            <div className="bg-secondary bg-opacity-25 rounded mb-3 skeleton-detail-info-medium" />
            <div className="bg-secondary bg-opacity-25 rounded skeleton-detail-info-xlarge" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailSkeleton;
