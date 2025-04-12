import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { IsLoggedInContext } from "./IsLoggedInCheck";

const RouteProtector = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useContext(IsLoggedInContext);
  const token = localStorage.getItem("token");

  if (!token || !isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  if (requiredRole === "admin" && !user?.isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RouteProtector;