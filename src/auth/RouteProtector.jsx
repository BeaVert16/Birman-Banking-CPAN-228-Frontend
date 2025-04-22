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

  if (user?.role === "ADMIN" && location.pathname === "/") {
    //redirect admin users to the admin dashboard if they try to access the root path
    return <Navigate to="/admin-dashboard/clients" replace />;
  }

  if (requiredRole === "ADMIN" && user?.role !== "ADMIN") {
    //check for admin role if required
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    user &&
    !user.activated &&
    location.pathname !== "/inbox" &&
    location.pathname !== "/settings" &&
    user.role !== "ADMIN" //ensure admin accounts are excluded
  ) {
    //not activated and trying to access a restricted page, redirect to inbox
    return <Navigate to="/inbox" replace />;
  }

  //if authenticated, activated (or accessing allowed pages), and meets role requirements, render children
  return children;
};

export default RouteProtector;
