import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./contexts/AuthContext";

import UserDetails from "./pages/UserDetails";
import Admin from "./pages/Admin";
import Bloggers from "./pages/Bloggers";
import BloggerDashboard from "./pages/BloggerDashboard";
import BloggerCooperations from "./pages/BloggerCooperations";
import CooperationDetails from "./pages/CooperationDetails";
import Dashboard from "./pages/Dashboard";
import DemoAccounts from "./pages/DemoAccounts";
import EmailConfirmed from "./pages/EmailConfirmed";
import Finance from "./pages/Finance";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Ranking from "./pages/Ranking";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import Users from "./pages/Users";

function HomePage() {
  const { perfil } = useAuth();

  if (perfil?.role === "admin") {
    return <Dashboard />;
  }

  return <BloggerDashboard />;
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
      Carregando...
    </div>
  );
}

function Protected({ children }) {
  const {
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

function AdminRoute({ children }) {
  const {
    loading,
    isAuthenticated,
    perfil,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (perfil?.role !== "admin") {
    return (
      <Navigate
        to="/app"
        replace
      />
    );
  }

  return children;
}

function PublicOnly({ children }) {
  const {
    loading,
    isAuthenticated,
  } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return (
      <Navigate
        to="/app"
        replace
      />
    );
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/app"
          element={
            <Protected>
              <HomePage />
            </Protected>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route
          path="/blogueiros"
          element={
            <AdminRoute>
              <Bloggers />
            </AdminRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          }
        />

        <Route
          path="/usuarios/:id"
          element={
            <AdminRoute>
              <UserDetails />
            </AdminRoute>
          }
        />

        <Route
          path="/configuracoes"
          element={
            <AdminRoute>
              <Settings />
            </AdminRoute>
          }
        />

        <Route
          path="/financeiro"
          element={
            <AdminRoute>
              <Finance />
            </AdminRoute>
          }
        />

        <Route
          path="/cooperacoes"
          element={
            <Protected>
              <BloggerCooperations />
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

        <Route
          path="/perfil"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />

        <Route
          path="/ranking"
          element={
            <Protected>
              <Ranking />
            </Protected>
          }
        />

        <Route
          path="/contas-demo"
          element={
            <Protected>
              <DemoAccounts />
            </Protected>
          }
        />

        <Route
          path="/estatisticas"
          element={
            <AdminRoute>
              <Statistics />
            </AdminRoute>
          }
        />

        <Route
          path="/email-confirmado"
          element={<EmailConfirmed />}
        />

        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />

        <Route
          path="/cadastro"
          element={
            <PublicOnly>
              <Register />
            </PublicOnly>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}