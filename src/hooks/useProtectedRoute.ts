import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export function useProtectedRoute() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (!loading && !user) {
    navigate("/login");
  }

  return { user, loading };
}
