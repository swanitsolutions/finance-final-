import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (!agreeTerms) {
      setFormError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    const res = await register({
      fullName,
      email,
      phone,
      username,
      password,
    });
    setIsLoading(false);

    if (res.success) {
      success('Account Created', 'Welcome to LoanEase! Your customer portal is ready.');
      navigate('/dashboard');
    } else {
      setFormError(res.message || 'Registration failed');
      error('Registration Error', res.message || 'Could not complete registration.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block focus:outline-none mb-4">
          <Logo size="lg" showTagline={true} />
        </Link>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#DFE7F0] shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#172B4D]">Create Your LoanEase Account</h2>
            <p className="text-xs text-[#687B94] mt-1">
              A simpler way to stay on top of your finances.
            </p>
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-[#FFF0F1] border border-[#DC5263]/30 rounded-xl text-xs text-[#9b2130]">
              {formError}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Phone Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="Choose unique username"
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-pass"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="rounded border-[#DFE7F0] text-[#5145CD]"
              />
              <label htmlFor="show-pass" className="text-xs text-[#687B94] cursor-pointer">
                Show passwords
              </label>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-[#DFE7F0] text-[#5145CD] mt-0.5"
                  required
                />
                <span className="text-[11px] text-[#687B94] leading-tight">
                  I agree to the <Link to="/terms" className="text-[#5145CD] underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#5145CD] underline">Privacy Policy</Link>.
                </span>
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
                  Creating Account...
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#687B94]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#5145CD] hover:underline">
              Log in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
