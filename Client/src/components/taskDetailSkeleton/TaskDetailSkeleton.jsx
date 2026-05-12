import React from "react";

function TaskDetailSkeleton() {
  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div
                className="bg-secondary bg-opacity-25 rounded"
                style={{ height: "40px", width: "60%" }}
              />
              <div
                className="bg-secondary bg-opacity-25 rounded"
                style={{ height: "32px", width: "80px" }}
              />
            </div>
            <div
              className="bg-secondary bg-opacity-25 rounded mb-3"
              style={{ height: "32px", width: "120px" }}
            />
            <div
              className="bg-secondary bg-opacity-25 rounded mb-3"
              style={{ height: "20px", width: "200px" }}
            />
            <div
              className="bg-secondary bg-opacity-25 rounded mb-3"
              style={{ height: "20px", width: "180px" }}
            />
            <div
              className="bg-secondary bg-opacity-25 rounded"
              style={{ height: "20px", width: "220px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailSkeleton;
