// src/router/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";

export function ProtectedRoute({ children }) {
  const { session, loading } = useSession();

  if (loading) return null; // o spinner

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
