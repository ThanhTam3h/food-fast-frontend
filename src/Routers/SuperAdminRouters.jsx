import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const SuperAdminRouters = ({ children }) => {
  const { auth } = useSelector((store) => store);
  const location = useLocation();
  const jwt = localStorage.getItem("jwt");

  const REQUIRED_ROLE = "admin";

  return children;
};
