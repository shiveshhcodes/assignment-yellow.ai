import { Navigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
interface ProtectedRouteProps {
  children: React.ReactNode;
}
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = authService.isTokenValid();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};