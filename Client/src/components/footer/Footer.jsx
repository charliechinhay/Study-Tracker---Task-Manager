function Footer() {
  return (
    <footer className="border-top mt-auto py-3 text-center">
      <small className="text-muted" style={{ fontSize: "0.75rem" }}>
        📚 Study Tracker &copy; {new Date().getFullYear()}
      </small>
    </footer>
  );
}

export default Footer;
