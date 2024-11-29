import { Navigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useUserStore(state => state.user);

  // السماح بالوصول لصفحة الإعداد حتى لو لم يكن هناك مستخدم
  if (window.location.pathname === '/setup') {
    return <>{children}</>;
  }

  // التحقق من وجود مستخدم للصفحات الأخرى
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 