import "./navBar.css";
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
    <nav className="navbar border-bottom navbar-main">
      <div className="container">
        <Link
          className="navbar-brand navbar-brand-custom d-flex align-items-center gap-2 fw-semibold"
          to="/dashboard"
        >
          <span className="navbar-brand-icon">📚</span>
          <span className="d-none d-sm-inline">Study Tracker</span>
          <span className="d-inline d-sm-none">Tasks</span>
        </Link>

        <div className="d-flex align-items-center gap-2">
          <button
            className="navbar-theme-btn"
            onClick={toggleTheme}
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            <span className="navbar-theme-icon">
              {theme === "light" ? "🌙" : "☀️"}
            </span>
            <span className="navbar-theme-label d-none d-sm-inline">
              {theme === "light" ? "Dark" : "Light"}
            </span>
          </button>

          <button className="navbar-signout-btn" onClick={handleLogout}>
            <span className="d-none d-sm-inline">Sign out</span>
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
