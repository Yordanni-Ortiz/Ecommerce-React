import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsLogged } from "../store/slices/isLogged.slice";

const ProtectedRoutes = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLogged.isLoggedIn);
  const token = localStorage.getItem("token");

  if (token && !isLoggedIn) {
    dispatch(setIsLogged()); // Sincroniza el estado de Redux con localStorage
  }

  return token && isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
