import { Navigate } from "react-router-dom";
import { Usercontext } from "../contexts/Usercontext";
import { useContext, useEffect } from "react";

export default function Private({ Component }) {
  const { loggedUser, isLoading, error } = useContext(Usercontext);

  useEffect(() => {
    // Validate token on component mount
    if (loggedUser?.token) {
      // You could add token validation logic here if needed
      console.log("Token present:", loggedUser.token);
    }
  }, [loggedUser]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.href = '/login'}>
          Return to Login
        </button>
      </div>
    );
  }

  return loggedUser ? <Component /> : <Navigate to="/login" replace />
}