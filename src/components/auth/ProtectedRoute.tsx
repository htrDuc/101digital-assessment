import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute() {
  const { accessToken, orgToken } = useAuth();

  if (!accessToken || !orgToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
