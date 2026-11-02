import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';
import { ShieldAlert, ArrowLeft, LayoutDashboard, LogIn } from 'lucide-react';

export const AccessDeniedPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#F3F5F6] flex flex-col justify-center items-center px-4 py-12 text-center">
      <Link to="/" className="mb-6 focus:outline-none">
        <Logo size="lg" showTagline={true} />
      </Link>

      <div className="bg-white rounded-3xl border border-[#DFE5E9] p-8 sm:p-10 max-w-lg w-full shadow-sm space-y-6">
        <div className="w-16 h-16 bg-[#FCEBED] text-[#C9414D] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <ShieldAlert className="w-9 h-9" />
        </div>

        <div>
          <div className="inline-block px-3 py-1 bg-[#FCEBED] text-[#C9414D] text-xs font-bold rounded-full mb-2">
            HTTP 403 · FORBIDDEN
          </div>
          <h1 className="text-2xl font-bold text-[#172B3A]">Access Denied</h1>
          <p className="text-xs text-[#536473] mt-2 leading-relaxed">
            You do not possess the required permission levels to access this protected financial zone.
          </p>
        </div>

        {isAuthenticated && user && (
          <div className="p-4 bg-[#F5F8FA] rounded-2xl border border-[#DFE5E9] text-left text-xs space-y-2">
            <div className="flex justify-between items-center text-[#536473]">
              <span>Active Session:</span>
              <span className="font-bold text-[#172B3A]">{user.fullName}</span>
            </div>
            <div className="flex justify-between items-center text-[#536473]">
              <span>Assigned System Role:</span>
              <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] uppercase bg-white border border-[#DFE5E9] text-[#153755]">
                {user.role}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#536473]">
              <span>Policy Restriction:</span>
              <span className="text-[#C9414D] font-medium">Role-Based Access Control (RBAC)</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {isAuthenticated && (
            <Link
              to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
              className="flex-1 py-2.5 px-4 bg-[#0D343B] hover:bg-[#082328] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
            </Link>
          )}
          <Link
            to="/"
            className="flex-1 py-2.5 px-4 bg-[#612536] hover:bg-[#4C1C2B] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
