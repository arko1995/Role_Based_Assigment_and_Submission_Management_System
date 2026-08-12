import React from "react";
import { useAuthStore } from "../store/authStore.js";
import { Navigate } from "react-router-dom";
const HomeRedirect = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/${user.role}`} replace />;
};

export default HomeRedirect;
