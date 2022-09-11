import React from "react";
import { Navigate } from "react-router-dom";


const AuthRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  // const navigate = useNavigate();
  if (token) {
    return (
      <>
        <Navigate to="/" replace />
      </>
    );
  } else {
    return children;
  }
};

export default AuthRoute; 
