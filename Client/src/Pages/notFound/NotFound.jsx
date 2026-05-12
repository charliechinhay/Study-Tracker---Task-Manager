import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3 mb-4">Page not found</p>
        <p className="text-muted mb-4">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
