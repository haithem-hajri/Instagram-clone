import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  // if (!token) {
  //   return (
  //     <>
  //       <Navigate to="/login" replace />
  //     </>
  //   );
  // } else {
  //   return children;
  // }
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
