import { Toaster } from "react-hot-toast";
import Login from "./Pages/login/Login.jsx";
import Welcome from "./Pages/welcome/Welcome.jsx";
import Layout from "./components/Layout/Layout.jsx";
import Register from "./Pages/register/Register.jsx";
import NotFound from "./Pages/notFound/NotFound.jsx";
import Dashboard from "./Pages/dashboard/Dashboard.jsx";
import { ThemeProvider } from "./contexts/ThemeContext";
import TaskDetails from "./Pages/taskDetail/TaskDetail.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
