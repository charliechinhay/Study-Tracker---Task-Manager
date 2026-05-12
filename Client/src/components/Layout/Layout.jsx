import NavBar from "../navBar/NavBar";
import Footer from "../footer/Footer";
import { Navigate, Outlet } from "react-router-dom";

function Layout() {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />;

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar />
      <main className="container py-3 py-sm-4 px-2 px-sm-3 flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
