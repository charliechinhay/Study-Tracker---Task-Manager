import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./Pages/login/Login.jsx";
import Register from "./Pages/register/Register.jsx";
import Dashboard from "./Pages/dashboard/Dashboard.jsx";
import Layout from "./components/Layout/Layout.jsx";
import Welcome from "./Pages/welcome/Welcome.jsx";
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
