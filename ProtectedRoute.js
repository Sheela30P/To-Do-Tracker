import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  
  // Log the value to check if it's true when the route is rendered
  // console.log("ProtectedRoute - isLoggedIn:", isLoggedIn);

  if (!isLoggedIn) {
    return <Navigate to="/" />; // Redirect to sign-in page if not logged in
  }

  // If logged in, return the children (which would be your protected component)
  return children;
}