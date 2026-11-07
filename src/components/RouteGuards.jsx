import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Splash() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/15 border-t-ink" />
    </div>
  );
}

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Splash />;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

export function RequireAdmin() {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <Splash />;
  if (!user) return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

export function GuestOnly() {
  const { user, loading } = useAuth();
  if (loading) return <Splash />;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
