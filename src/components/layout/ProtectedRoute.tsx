import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F8FC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#5145CD]/20 border-t-[#5145CD] rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#687B94]">Verifying secure session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // If a customer tries to access admin routes
    if (requiredRole === 'admin' && user.role !== 'admin') {
      return (
        <div className="min-h-screen bg-[#F4F8FC] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#DFE7F0] p-8 text-center shadow-lg">
            <div className="w-14 h-14 bg-[#FFF0F1] text-[#DC5263] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#172B4D]">Administrator Access Required</h2>
            <p className="text-xs text-[#687B94] mt-2 leading-relaxed">
              This area is restricted to authenticated administrators. Customers are not permitted to access administrative controls or records.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href="/dashboard"
                className="px-4 py-2.5 bg-[#5145CD] text-white text-xs font-semibold rounded-xl hover:bg-[#4036B5] transition-colors"
              >
                Return to Customer Dashboard
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
