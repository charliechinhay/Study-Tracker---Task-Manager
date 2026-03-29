import { Navigate, Outlet } from "react-router-dom";
import NavBar from "../navBar/NavBar";
import Footer from "../footer/Footer";

function Layout() {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="container py-4 flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
