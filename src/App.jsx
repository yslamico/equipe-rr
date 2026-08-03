import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";

import Admin from "./pages/Admin";
import Bloggers from "./pages/Bloggers";
import CooperationDetails from "./pages/CooperationDetails";
import Dashboard from "./pages/Dashboard";
import Finance from "./pages/Finance";
import Login from "./pages/Login";

function Protected({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/admin"
          element={
            <Protected>
              <Admin />
            </Protected>
          }
        />
        <Route
          path="/blogueiros"
          element={
            <Protected>
              <Bloggers />
            </Protected>
          }
        />
        <Route
          path="/financeiro"
          element={
            <Protected>
              <Finance />
            </Protected>
          }
        />
        <Route
          path="/cooperacao"
          element={
            <Protected>
              <CooperationDetails />
            </Protected>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}