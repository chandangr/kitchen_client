import { getAuthUserData } from "@/lib/utils";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const userDetails = getAuthUserData();

  // Check if the session exists
  if (!userDetails?.id) {
    return <Navigate to="/login" replace />;
  }

  // Render the child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
