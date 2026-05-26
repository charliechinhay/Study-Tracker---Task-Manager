import "./register.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest, BASE_URL } from "../../services/api";
import { motion } from "framer-motion";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSuccess(true);
      toast.success("Account created!");
    } catch {
      toast.error("Registration failed. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const baseUrl = BASE_URL.replace(/\/api.*$/, "").replace(/\/+$/, "");
    window.location.href = `${baseUrl}/api/auth/google`;
  };

  if (success) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card bg-body rounded-4 shadow-lg p-4 p-md-5 text-center">
          <div className="icon-success-create mb-3">✅</div>
          <h2 className="auth-heading fw-bold mb-2">Account created!</h2>
          <p className="text-muted small mb-4">
            Your account is ready. Sign in to get started.
          </p>
          <button
            className="btn btn-primary px-5 fw-semibold"
            onClick={() => navigate("/login")}
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

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
          <div className="icon-book-25 mb-2">📚</div>
          <h2 className="auth-heading fw-bold mb-1">Create account</h2>
          <p className="text-muted small mb-0">Start tracking your study goals</p>
        </div>

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
              <><span className="spinner-border spinner-border-sm me-2" />Creating…</>
            ) : (
              "Create account"
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
          Already have an account?{" "}
          <Link to="/login" className="fw-semibold text-primary text-decoration-none">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default Register;
