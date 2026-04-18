function Welcome() {
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
