import "./register.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest, BASE_URL } from "../../services/api";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setSuccess(true);
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error(
        "Registration failed. Please check your details and try again. " +
          error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  if (success) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card bg-body rounded-4 shadow-lg p-4 p-md-5 text-center">
          <div className="icon-success-create">✅</div>
          <h2 className="fw-bold mt-3 mb-2">Account created!</h2>
          <p className="text-muted mb-4">
            Your account has been created successfully. You can now sign in.
          </p>
          <button
            className="btn btn-primary btn-lg px-5 fw-semibold"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card bg-body rounded-4 shadow-lg p-4 p-md-5">
        <div className="text-center mb-4">
          <div className="icon-book-25">📚</div>
          <h2 className="fw-bold mt-2 mb-1">Create account</h2>
          <p className="text-muted small mb-0">
            Start tracking your study goals
          </p>
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
                Creating account...
              </>
            ) : (
              "Create account"
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="fw-semibold text-primary text-decoration-none"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
