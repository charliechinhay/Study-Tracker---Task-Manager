import React from "react";

function TaskCardSkeleton() {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div style={{ flex: 1 }}>
            <div
              className="bg-secondary bg-opacity-25 rounded mb-2"
              style={{ height: "20px", width: "70%" }}
            />
            <div className="d-flex gap-2">
              <div
                className="bg-secondary bg-opacity-25 rounded"
                style={{ height: "24px", width: "60px" }}
              />
              <div
                className="bg-secondary bg-opacity-25 rounded"
                style={{ height: "24px", width: "100px" }}
              />
            </div>
          </div>
          <div className="d-flex gap-2">
            <div
              className="bg-secondary bg-opacity-25 rounded"
              style={{ height: "31px", width: "50px" }}
            />
            <div
              className="bg-secondary bg-opacity-25 rounded"
              style={{ height: "31px", width: "50px" }}
            />
            <div
              className="bg-secondary bg-opacity-25 rounded"
              style={{ height: "31px", width: "60px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCardSkeleton;
