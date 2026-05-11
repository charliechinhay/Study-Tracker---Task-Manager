import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import "./welcome.css";

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
      <div className="container py-5">
        <div className="row justify-content-center text-center">
          <div className="col-lg-5 col-md-8">
            <div className="mb-4" style={{ fontSize: "3rem" }}>📚</div>
            <h1 className="display-5 fw-bold mb-3 text-white">Study Tracker</h1>
            <p className="mb-5" style={{ color: "rgba(255,255,255,0.78)" }}>
              Stay organized, track your tasks, and achieve your study goals.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/login" className="btn btn-light btn-lg px-5 fw-semibold">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-outline-light btn-lg px-5">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
