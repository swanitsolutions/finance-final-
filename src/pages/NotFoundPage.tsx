import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F3F5F6] flex flex-col justify-center items-center px-4 text-center">
      <Link to="/" className="mb-6 focus:outline-none">
        <Logo size="lg" showTagline={true} />
      </Link>

      <div className="bg-white rounded-3xl border border-[#DFE5E9] p-8 sm:p-12 max-w-md w-full shadow-sm space-y-5">
        <div className="w-16 h-16 bg-[#FCEBED] text-[#C9414D] rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
          404
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#172B3A]">Page Not Found</h2>
          <p className="text-xs text-[#536473] mt-1.5 leading-relaxed">
            The page you requested does not exist or has been relocated within the financial system.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Link
            to="/"
            className="flex-1 py-2.5 px-4 bg-[#612536] hover:bg-[#4C1C2B] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" /> Return Home
          </Link>
          <Link
            to="/dashboard"
            className="flex-1 py-2.5 px-4 bg-[#F5F8FA] hover:bg-gray-200 text-[#172B3A] border border-[#DFE5E9] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

