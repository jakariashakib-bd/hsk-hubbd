import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AdminGuard = ({ children }: { children: ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground font-mono">Loading...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-4xl mb-2">🔒</p>
        <h2 className="text-2xl font-bold mb-1">Access Denied</h2>
        <p className="text-muted-foreground font-mono text-sm">You need admin privileges to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGuard;
