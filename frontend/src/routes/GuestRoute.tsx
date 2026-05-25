import { Navigate, Outlet } from "react-router-dom";

import { StateBlock } from "../components/ui/StateBlock";
import { useAuth } from "../features/auth/AuthContext";

export function GuestRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <StateBlock title="Checking your session" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
