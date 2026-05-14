import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Statistics({ tasks }) {
  const completed = tasks.filter((t) => t.completed).length;
  const active = tasks.filter((t) => !t.completed).length;

  const completionData = [
    { name: "Completed", value: completed, color: "#198754" },
    { name: "Active", value: active, color: "#6c757d" },
  ];

  const priorityData = [
    {
      name: "High",
      count: tasks.filter((t) => t.priority === "High").length,
      color: "#dc3545",
    },
    {
      name: "Medium",
      count: tasks.filter((t) => t.priority === "Medium").length,
      color: "#ffc107",
    },
    {
      name: "Low",
      count: tasks.filter((t) => t.priority === "Low").length,
      color: "#198754",
    },
  ];

  const completionRate =
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div>
      <h3 className="mb-4">Statistics</h3>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h5 className="text-muted mb-2">Total Tasks</h5>
            <h2 className="mb-0">{tasks.length}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h5 className="text-muted mb-2">Completed</h5>
            <h2 className="mb-0 text-success">{completed}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h5 className="text-muted mb-2">Active</h5>
            <h2 className="mb-0 text-secondary">{active}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center p-3">
            <h5 className="text-muted mb-2">Completion Rate</h5>
            <h2 className="mb-0 text-primary">{completionRate}%</h2>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="mb-3">Completion Status</h5>
            {tasks.length === 0 ? (
              <p className="text-muted text-center">No tasks yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3">
            <h5 className="mb-3">Tasks by Priority</h5>
            {tasks.length === 0 ? (
              <p className="text-muted text-center">No tasks yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={priorityData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {priorityData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
