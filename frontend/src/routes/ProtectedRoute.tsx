import { Navigate, Outlet, useLocation } from "react-router-dom";

import { StateBlock } from "../components/ui/StateBlock";
import { useAuth } from "../features/auth/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return <StateBlock title="Checking your session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
