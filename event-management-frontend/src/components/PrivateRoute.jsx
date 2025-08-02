// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const userToken = localStorage.getItem('userToken'); // Check for token in localStorage

  // If a token exists, render the child routes (Outlet)
  // Otherwise, navigate to the login page
  return userToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;