import { Navigate, useLocation } from "react-router-dom";
import { useGetUserInfo } from "../hooks/useGetUserInfo";

export const ProtectedRoute = ({ children }) => {
  const { isAuth, loading } = useGetUserInfo();
  const location = useLocation();

  // Wait for Firebase auth state to initialize before deciding to redirect
  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!isAuth) {
    // Redirect unauthenticated user to login page, preserving the intended location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};