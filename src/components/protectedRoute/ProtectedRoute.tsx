import React, { ReactNode, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';
import UnauthorizedPage from '../../pages/unauthorized/Unauthorized';

interface TokenPayload {
  exp: number;
  role?: string;
}

interface UserState {
  isValid: boolean;
  role: string | null;
}

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const [user, setUser] = useState<UserState>(isTokenValid());

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(isTokenValid());
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!user.isValid) {
    return <Navigate to="/" />;
  }

  if (
    allowedRoles.length > 0 &&
    (!user.role || !allowedRoles.includes(user.role))
  ) {
    return <UnauthorizedPage/>
  }

  return <>{children}</>;
};


function isTokenValid(): UserState {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const expDate = new Date(decoded.exp * 1000);
      const currentDate = new Date();

      if (currentDate <= expDate) {
        return { isValid: true, role: decoded.role || "" };
      }
    } catch (error) {
      console.error("An error occurred while decoding the token:", error);
      return { isValid: false, role: null };
    }
  }
  return { isValid: false, role: null };
}

export default ProtectedRoute;