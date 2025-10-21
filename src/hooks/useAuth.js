import { useSelector } from "react-redux";

// Simple JWT decode function (without verification)
const decodeJWT = (token) => {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

const useAuth = () => {
  const auth = useSelector((state) => state.auth);

  // Decode the token to get user information
  const decodedToken = decodeJWT(auth?.token);

  return {
    user: auth?.user,
    token: auth?.token,
    refreshToken: auth?.refreshToken,
    isAuthenticated: auth?.isAuthenticated,
    // Extract user ID from decoded token
    userId: decodedToken?.userId,
    userRole: decodedToken?.role,
    userEmail: decodedToken?.email,
    userFullName: decodedToken?.fullName,
  };
};

export default useAuth;
