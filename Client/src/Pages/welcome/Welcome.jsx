import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Handle Google OAuth callback with token
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  }, [navigate, searchParams]);

  return (
    <div className="welcome-container">
      <h1>Welcome to Study Tracker</h1>
      <p>Your all-in-one solution for managing study sessions and tasks.</p>
      <div className="welcome-buttons">
        <a href="/login" className="btn btn-primary">
          Login
        </a>
        <a href="/register" className="btn btn-secondary">
          Register
        </a>
      </div>
    </div>
  );
}

export default Welcome;
