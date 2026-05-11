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
          <span>📚</span> Study Tracker
        </Link>
        <div className="d-flex gap-2 align-items-center">
          <button
            className="btn btn-sm btn-outline-secondary rounded-pill px-3"
            onClick={toggleTheme}
          >
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <button
            className="btn btn-sm btn-danger rounded-pill px-3"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
