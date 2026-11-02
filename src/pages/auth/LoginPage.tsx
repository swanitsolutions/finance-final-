import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Eye, EyeOff, Lock, User, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showCenterModal, error } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const registeredId = (location.state as any)?.registeredIdentifier || '';
  const [identifier, setIdentifier] = useState(registeredId);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    const res = await login(identifier, password);
    setIsLoading(false);

    if (res.success) {
      const from = (location.state as any)?.from?.pathname;
      const targetPath = from || (res.role === 'admin' ? '/admin/dashboard' : '/dashboard');

      showCenterModal({
        type: 'success',
        title: 'Signed In Successfully!',
        message: 'Welcome back to LoanEase. Your authenticated financial session is active.',
        buttonText: 'Open Dashboard',
        autoCloseMs: 2000,
        onConfirm: () => navigate(targetPath, { replace: true }),
      });
    } else {
      setErrorMessage(res.message || 'Invalid credentials.');
      error('Login Failed', res.message || 'Invalid email/username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block focus:outline-none mb-4">
          <Logo size="lg" showTagline={true} />
        </Link>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#DFE5E9] shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#172B3A]">Welcome Back</h2>
            <p className="text-xs text-[#536473] mt-1">
              Log in to securely access your LoanEase financial accounts.
            </p>
          </div>

          {registeredId && (
            <div className="mb-4 p-3 bg-[#E6F4EE] border border-[#218568]/30 rounded-xl text-xs text-[#218568]">
              Account registered successfully! Enter your password to sign in.
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-[#FCEBED] border border-[#C9414D]/30 rounded-xl text-xs text-[#C9414D]">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B8994]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or username"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#172B3A]">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#612536] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B8994]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7B8994] hover:text-[#172B3A] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#DFE5E9] text-[#612536] focus:ring-[#612536]"
                />
                <span className="text-xs text-[#536473]">Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#612536] hover:bg-[#4C1C2B] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#536473]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#612536] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
