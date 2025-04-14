import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { IsLoggedInContext } from "./IsLoggedInCheck";

const RouteProtector = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useContext(IsLoggedInContext);
  const location = useLocation();
  const token = localStorage.getItem("token");
  if (!token || !isAuthenticated) {
    //not authenticated, redirect to login
    return <Navigate to="/" replace />;
  }

  if (user?.isAdmin && location.pathname === "/") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  //check for admin role if required
  if (requiredRole === "ADMIN" && !user?.isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  //check if the user is activated
  if (
    user &&
    !user.activated &&
    location.pathname !== "/inbox" &&
    location.pathname !== "/settings" &&
    user.role !== "ADMIN" // Ensure admin accounts are excluded
  ) {
    // not activated and trying to access a restricted page, redirect to inbox
    return <Navigate to="/inbox" replace />;
  }
  // If authenticated, activated (or accessing allowed pages), and meets role requirements, render children
  return children;
};

export default RouteProtector;
