import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectMap = {
      ADMIN: '/admin',
      PROFESSIONAL: '/professional/dashboard',
      CLIENT: '/client/dashboard',
      SUPPORT: '/support',
    };
    return <Navigate to={redirectMap[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
