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
      <div className="container py-5 px-3">
        <div className="row justify-content-center text-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">
            <div className="mb-4 icon-book">📚</div>
            <h1 className="display-5 fw-bold mb-3 text-white">Study Tracker</h1>
            <p className="mb-4 mb-sm-5 px-2 text-white-book">
              Stay organized, track your tasks, and achieve your study goals.
            </p>
            <div className="d-flex gap-2 gap-sm-3 justify-content-center flex-column flex-sm-row px-2">
              <Link
                to="/login"
                className="btn btn-light btn-lg px-4 px-sm-5 fw-semibold"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="btn btn-outline-light btn-lg px-4 px-sm-5"
              >
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
