import React from 'react';
import { Navigate } from 'react-router-dom';

// A simple component to protect routes
const ProtectedRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
