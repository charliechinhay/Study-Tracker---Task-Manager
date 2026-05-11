import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { apiRequest, BASE_URL } from "../../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
    const errorParam = searchParams.get("error");
    if (errorParam === "google_failed") {
      setError("Google login failed. Please try again.");
    }
  }, [navigate, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError(
        "Login failed. Please check your credentials and try again. " +
          error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card bg-body rounded-4 shadow-lg p-4 p-md-5">
        <div className="text-center mb-4">
          <div style={{ fontSize: "2.5rem" }}>📚</div>
          <h2 className="fw-bold mt-2 mb-1">Welcome back</h2>
          <p className="text-muted small mb-0">Sign in to your account</p>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label fw-medium">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="d-flex align-items-center my-4">
          <hr className="flex-grow-1" />
          <span className="px-3 text-muted small">or continue with</span>
          <hr className="flex-grow-1" />
        </div>

        <button
          className="btn btn-outline-secondary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={handleGoogleLogin}
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            width="18"
            height="18"
          />
          Google
        </button>

        <p className="text-center mt-4 mb-0 small text-muted">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="fw-semibold text-primary text-decoration-none"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
