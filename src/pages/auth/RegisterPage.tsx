import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Check, Sparkles, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showCenterModal, showToast, warning } = useNotification();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Password verification criteria
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const criteriaMetCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const isStrongPassword = criteriaMetCount === 5;

  const getStrengthLabel = () => {
    if (!password) return '';
    if (criteriaMetCount <= 2) return 'Weak';
    if (criteriaMetCount <= 4) return 'Moderate';
    return 'Strong & Verified';
  };

  const getStrengthColor = () => {
    if (criteriaMetCount <= 2) return 'text-[#C9414D]';
    if (criteriaMetCount <= 4) return 'text-[#C28A20]';
    return 'text-[#218568]';
  };

  // Generate strong suggested password
  const handleSuggestPassword = () => {
    const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowers = 'abcdefghijkmnpqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%^&*';

    const pick = (str: string) => str[Math.floor(Math.random() * str.length)];

    const chars = [
      pick(uppers),
      pick(uppers),
      pick(lowers),
      pick(lowers),
      pick(numbers),
      pick(numbers),
      pick(symbols),
      pick(symbols),
      pick(uppers + lowers),
      pick(numbers + symbols),
      pick(uppers + lowers),
      pick(numbers + symbols),
    ];

    const suggested = chars.sort(() => Math.random() - 0.5).join('');
    setPassword(suggested);
    // User must refill the confirm password manually (no auto fill)
    setConfirmPassword('');
    setShowPassword(true);
    setFormError('');
    showToast({
      type: 'info',
      title: 'Strong Password Suggested',
      message: 'Generated a secure 12-character password. Please re-type it in Confirm Password.',
      duration: 4000,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!isStrongPassword) {
      const msg = 'Please ensure your password satisfies all 5 strength criteria, or click "Suggest Strong Password".';
      setFormError(msg);
      warning('Password Security Warning', msg);
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match. Please refill and verify your confirm password field.';
      setFormError(msg);
      warning('Password Mismatch', msg);
      return;
    }

    if (!agreeTerms) {
      const msg = 'You must agree to the Terms of Service and Privacy Policy to create an account.';
      setFormError(msg);
      warning('Terms Required', msg);
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
      // Pop up in the center of the screen, then navigate to login
      showCenterModal({
        type: 'success',
        title: 'Registration Successful!',
        message: `Welcome, ${fullName}! Your LoanEase account has been registered successfully. Please sign in with your credentials to access your dashboard.`,
        buttonText: 'Proceed to Sign In',
        autoCloseMs: 3000,
        onConfirm: () => {
          navigate('/login', {
            state: { registeredIdentifier: username || email },
            replace: true,
          });
        },
      });
    } else {
      setFormError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F5F6] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block focus:outline-none mb-4">
          <Logo size="lg" showTagline={true} />
        </Link>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#DFE5E9] shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#172B3A]">Create Your LoanEase Account</h2>
            <p className="text-xs text-[#536473] mt-1">
              Transparent, modern financial management and automated EMI tracking.
            </p>
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-[#FCEBED] border border-[#C9414D]/30 rounded-xl text-xs text-[#C9414D]">
              {formError}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">Full Name *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B8994]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1">Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B8994]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1">Phone Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B8994]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="Choose unique username"
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
              />
            </div>

            {/* Password Section with Strength Suggestion & Verification */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-semibold text-[#172B3A]">Password *</label>
                  {password && (
                    <span className={`text-[10px] font-bold ${getStrengthColor()}`}>
                      ({getStrengthLabel()})
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSuggestPassword}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#612536] hover:text-[#4C1C2B] hover:underline bg-[#F5F8FA] px-2 py-0.5 rounded-md border border-[#DFE5E9] transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-[#E65327]" />
                  <span>Suggest Strong Password</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B8994]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create secure password"
                    required
                    autoComplete="new-password"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7B8994] hover:text-[#172B3A] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B8994]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Refill to confirm password"
                    required
                    autoComplete="new-password"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7B8994] hover:text-[#172B3A] cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Strength Meter Bar */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="grid grid-cols-5 gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 rounded-full transition-colors ${
                          level <= criteriaMetCount
                            ? criteriaMetCount <= 2
                              ? 'bg-[#C9414D]'
                              : criteriaMetCount <= 4
                              ? 'bg-[#C28A20]'
                              : 'bg-[#218568]'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Password Verification Criteria Checklist */}
              <div className="mt-2.5 p-3 bg-[#F5F8FA] rounded-xl border border-[#DFE5E9] space-y-1.5">
                <p className="text-[10px] font-bold text-[#172B3A] uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#153755]" />
                  Password Security Requirements:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                  <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-[#218568] font-medium' : 'text-[#7B8994]'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasMinLength ? 'bg-[#E6F4EE] text-[#218568]' : 'bg-gray-200 text-gray-500'}`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>At least 8 characters</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-[#218568] font-medium' : 'text-[#7B8994]'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasUpper ? 'bg-[#E6F4EE] text-[#218568]' : 'bg-gray-200 text-gray-500'}`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>One uppercase letter (A-Z)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${hasLower ? 'text-[#218568] font-medium' : 'text-[#7B8994]'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasLower ? 'bg-[#E6F4EE] text-[#218568]' : 'bg-gray-200 text-gray-500'}`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>One lowercase letter (a-z)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-[#218568] font-medium' : 'text-[#7B8994]'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasNumber ? 'bg-[#E6F4EE] text-[#218568]' : 'bg-gray-200 text-gray-500'}`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>At least one number (0-9)</span>
                  </div>

                  <div className={`flex items-center gap-1.5 sm:col-span-2 ${hasSpecial ? 'text-[#218568] font-medium' : 'text-[#7B8994]'}`}>
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${hasSpecial ? 'bg-[#E6F4EE] text-[#218568]' : 'bg-gray-200 text-gray-500'}`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>One special symbol (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-[#DFE5E9] text-[#612536] focus:ring-[#612536] mt-0.5"
                  required
                />
                <span className="text-[11px] text-[#536473] leading-tight">
                  I agree to the <Link to="/terms" className="text-[#612536] underline">Terms of Service</Link> and <Link to="/privacy" className="text-[#612536] underline">Privacy Policy</Link>.
                </span>
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

          <div className="mt-6 text-center text-xs text-[#536473]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#612536] hover:underline">
              Log in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
