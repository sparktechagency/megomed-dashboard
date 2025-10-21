import { Navigate } from "react-router-dom";
import { getToken, isAuthenticated } from "../features/auth/authService";

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated using the token
  const isAuth = getToken();
  console.log("isAuth", isAuth);

  // If the user is not authenticated, redirect to login
  if (!isAuth) {
    return <Navigate to="/auth/login" replace />;
  }

  // Otherwise, render the children (protected content)
  return children;
};

export default ProtectedRoute;
