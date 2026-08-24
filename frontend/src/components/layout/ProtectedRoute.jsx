import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  console.log("DEBUG - isAuthenticated:", isAuthenticated, "user role:", user?.role, "allowed:", allowedRoles);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}