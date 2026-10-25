import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Eye, EyeOff, Lock, User, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickSwitchUser } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('priya');
  const [password, setPassword] = useState('password123');
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
      success('Welcome Back', 'Authentication successful.');
      const from = (location.state as any)?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (res.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setErrorMessage(res.message || 'Invalid credentials.');
      error('Login Failed', res.message || 'Invalid email/username or password.');
    }
  };

  const handleAutofill = (type: 'customer' | 'admin') => {
    if (type === 'customer') {
      setIdentifier('priya');
      setPassword('password123');
    } else {
      setIdentifier('admin');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block focus:outline-none mb-4">
          <Logo size="lg" showTagline={true} />
        </Link>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#DFE7F0] shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#172B4D]">Welcome Back!</h2>
            <p className="text-xs text-[#687B94] mt-1">Log in to access your account.</p>
          </div>

          {/* Quick Demo Autofill Badges */}
          <div className="mb-6 p-3 bg-[#F4F8FC] rounded-xl border border-[#DFE7F0]">
            <p className="text-[11px] font-semibold text-[#687B94] uppercase tracking-wider mb-2">
              Quick Test Credentials:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAutofill('customer')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-gray-50 border border-[#DFE7F0] rounded-lg text-xs font-medium text-[#172B4D] flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#159A78]" />
                Customer (Priya)
              </button>
              <button
                type="button"
                onClick={() => handleAutofill('admin')}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-gray-50 border border-[#DFE7F0] rounded-lg text-xs font-medium text-[#172B4D] flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#5145CD]" />
                Admin (Admin)
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-[#FFF0F1] border border-[#DC5263]/30 rounded-xl text-xs text-[#9b2130]">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or username"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#172B4D]">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#5145CD] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-9 pr-10 py-2.5 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
                  className="rounded border-[#DFE7F0] text-[#5145CD] focus:ring-[#5145CD]"
                />
                <span className="text-xs text-[#687B94]">Remember me for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#5145CD] hover:bg-[#4036B5] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#687B94]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#5145CD] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
