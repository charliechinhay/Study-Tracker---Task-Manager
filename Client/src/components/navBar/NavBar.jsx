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
    <nav className={`navbar navbar-expand-lg navbar-${theme} bg-${theme === "light" ? "light" : "dark"} border-bottom`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          Study Tracker
        </Link>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={toggleTheme}
          >
            {theme === "light" ? "Dark" : "Light"} Mode
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
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
