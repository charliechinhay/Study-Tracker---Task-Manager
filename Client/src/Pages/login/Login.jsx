import "./login.css";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { apiRequest, BASE_URL } from "../../services/api";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
    if (searchParams.get("error") === "google_failed") {
      toast.error("Google login failed. Please try again.");
    }
  }, [navigate, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch {
      toast.error("Login failed. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      const data = await apiRequest("/auth/demo", { method: "POST" });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch {
      toast.error("Demo login failed. Please try again.");
    } finally {
      setDemoLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const baseUrl = BASE_URL.replace(/\/api.*$/, "").replace(/\/+$/, "");
    window.location.href = `${baseUrl}/api/auth/google`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="auth-wrapper"
    >
      <div className="auth-card bg-body rounded-4 shadow-lg p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="auth-logo">📚</div>
          <h2 className="auth-heading fw-bold mb-1">Welcome back</h2>
          <p className="text-muted small mb-0">Sign in to continue</p>
        </div>

        <button
          className="btn btn-success w-100 mb-1 fw-medium"
          onClick={handleDemoLogin}
          disabled={demoLoading}
        >
          {demoLoading ? (
            <><span className="spinner-border spinner-border-sm me-2" />Loading…</>
          ) : (
            "🚀 Try demo account"
          )}
        </button>
        <p className="auth-hint text-center text-muted mb-3">No signup required</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium small">Email</label>
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
            <label className="form-label fw-medium small">Password</label>
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
              <><span className="spinner-border spinner-border-sm me-2" />Signing in…</>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="auth-divider">or continue with</div>

        <button
          className="btn btn-outline-secondary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={handleGoogleLogin}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" width="16" height="16" />
          Google
        </button>

        <p className="text-center mt-4 mb-0 small text-muted">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="fw-semibold text-primary text-decoration-none">
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default Login;
