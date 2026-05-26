import "./statistics.css";
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
} from "recharts";

const tooltipStyle = {
  fontSize: "0.8125rem",
  borderRadius: "0.5rem",
  border: "1px solid var(--bs-border-color)",
  background: "var(--bs-body-bg)",
};

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card">
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <p className="stat-card-label text-muted">{label}</p>
          <p className="stat-card-value" style={{ color }}>{value}</p>
        </div>
        <span className="stat-card-icon">{icon}</span>
      </div>
    </div>
  );
}

function Statistics({ tasks }) {
  const completed = tasks.filter((t) => t.completed).length;
  const active = tasks.filter((t) => !t.completed).length;
  const completionRate =
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  const completionData = [
    { name: "Completed", value: completed, color: "#10b981" },
    { name: "Active", value: active, color: "#6366f1" },
  ];

  const priorityData = [
    { name: "High", count: tasks.filter((t) => t.priority === "high").length, color: "#ef4444" },
    { name: "Med", count: tasks.filter((t) => t.priority === "medium").length, color: "#f59e0b" },
    { name: "Low", count: tasks.filter((t) => t.priority === "low").length, color: "#10b981" },
  ];

  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-6 col-sm-3">
          <StatCard icon="📋" label="Total" value={tasks.length} />
        </div>
        <div className="col-6 col-sm-3">
          <StatCard icon="✅" label="Done" value={completed} color="#10b981" />
        </div>
        <div className="col-6 col-sm-3">
          <StatCard icon="⏳" label="Active" value={active} color="#6366f1" />
        </div>
        <div className="col-6 col-sm-3">
          <StatCard icon="📈" label="Rate" value={`${completionRate}%`} color="#f59e0b" />
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="row g-3">
          <div className="col-12 col-sm-6">
            <div className="stat-card">
              <p className="stat-chart-label text-muted">Completion</p>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={35}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {completionData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="stat-card">
              <p className="stat-chart-label text-muted">By Priority</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={priorityData} barSize={32}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Statistics;
