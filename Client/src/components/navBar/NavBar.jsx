import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

function NavBar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg border-bottom bg-body-tertiary">
      <div className="container">
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-5"
          to="/dashboard"
        >
          <span>📚</span>{" "}
          <span className="d-none d-sm-inline">Study Tracker</span>
          <span className="d-inline d-sm-none">Tasks</span>
        </Link>
        <div className="d-flex gap-1 gap-sm-2 align-items-center">
          <button
            className="btn btn-sm btn-outline-secondary rounded-pill px-2 px-sm-3"
            onClick={toggleTheme}
            title={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            <span className="d-none d-sm-inline">
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </span>
            <span className="d-inline d-sm-none">
              {theme === "light" ? "🌙" : "☀️"}
            </span>
          </button>
          <button
            className="btn btn-sm btn-danger rounded-pill px-2 px-sm-3"
            onClick={handleLogout}
          >
            <span className="d-none d-sm-inline">Logout</span>
            <span className="d-inline d-sm-none">
              <i className="bi bi-box-arrow-right" />
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
