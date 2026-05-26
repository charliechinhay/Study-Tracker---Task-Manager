import "./welcome.css";
import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  }, [navigate, searchParams]);

  return (
    <div className="welcome-hero min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container py-5 px-3">
        <div className="row justify-content-center text-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">
            <div className="welcome-badge">
              <span>📚</span>
              <span>Study Tracker</span>
            </div>

            <h1 className="welcome-title">
              Track tasks,<br />reach goals.
            </h1>

            <p className="welcome-subtitle">
              Stay organized, focus on what matters, and build better study habits — one task at a time.
            </p>

            <div className="d-flex gap-3 justify-content-center flex-column flex-sm-row">
              <Link to="/login" className="welcome-btn-primary">
                Sign in
              </Link>
              <Link to="/register" className="welcome-btn-secondary">
                Create account
              </Link>
            </div>

            <div className="welcome-features">
              <span className="welcome-feature">
                <span>✓</span> Task management
              </span>
              <span className="welcome-feature">
                <span>✓</span> Progress tracking
              </span>
              <span className="welcome-feature">
                <span>✓</span> Free to use
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
