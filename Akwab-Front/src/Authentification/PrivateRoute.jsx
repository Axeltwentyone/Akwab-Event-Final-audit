import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute({ adminOnly = false }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && user.id_role !== 1) return <Navigate to="/" replace />;
  return <Outlet />;
}
