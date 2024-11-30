import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, UserRole } from '../types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, requiredRole, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();
  const publicPaths = ['/login', '/signup', '/client/quote', '/client/receipt', '/client/order'];
  
  // Check if current path is a public path
  const isPublicPath = publicPaths.some(path => location.pathname.startsWith(path));
  if (isPublicPath) {
    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check specific required role
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Check allowed roles
  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}