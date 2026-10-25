import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { calculateEMI } from '../../lib/calculations/emi';
import { formatINR } from '../../lib/formatters/currency';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Calculator,
  CheckCircle2,
  FileText,
  CreditCard,
  BarChart3,
  Users,
  ChevronRight,
  Home,
  HelpCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Hero Quick Login Card State
  const [loginIdentifier, setLoginIdentifier] = useState('priya');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Interactive EMI Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(200000);
  const [calcRate, setCalcRate] = useState<number>(12);
  const [calcTenure, setCalcTenure] = useState<number>(24);

  const emiResult = calculateEMI(calcAmount, calcRate, calcTenure);

  const handleHeroLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const res = await login(loginIdentifier, loginPassword);
    setLoginLoading(false);

    if (res.success) {
      if (res.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setLoginError(res.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden border-b border-[#DFE7F0]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DFE7F0] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#159A78]" />
                <span className="text-xs font-semibold text-[#12365A] tracking-wide">
                  Secure • Simple • Trusted
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#12365A] tracking-tight leading-[1.15]">
                  Your Financial <br />
                  Goals, <span className="text-[#5145CD]">Our Priority</span>
                </h1>
                <p className="text-base sm:text-lg text-[#687B94] max-w-xl leading-relaxed">
                  Apply for loans, track your EMIs, and manage your finances all in one place. Fast, secure, and easy.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/register"
                  className="px-6 py-3.5 bg-[#5145CD] hover:bg-[#4036B5] text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 bg-white hover:bg-gray-50 text-[#172B4D] border border-[#DFE7F0] rounded-xl text-sm font-semibold transition-colors shadow-2xs"
                >
                  Learn More
                </a>
              </div>

              {/* 4 Feature Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#DFE7F0]/70">
                <div className="space-y-1">
                  <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#172B4D]">Quick Loan Approval</h4>
                  <p className="text-[11px] text-[#687B94] leading-tight">Get your loan in less time</p>
                </div>

                <div className="space-y-1">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100/70 text-[#5145CD] flex items-center justify-center mb-2">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#172B4D]">Easy EMI Tracking</h4>
                  <p className="text-[11px] text-[#687B94] leading-tight">Never miss a due date</p>
                </div>

                <div className="space-y-1">
                  <div className="w-9 h-9 rounded-lg bg-[#E7F7F0] text-[#159A78] flex items-center justify-center mb-2">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#172B4D]">Secure & Reliable</h4>
                  <p className="text-[11px] text-[#687B94] leading-tight">Your data is always safe</p>
                </div>

                <div className="space-y-1">
                  <div className="w-9 h-9 rounded-lg bg-rose-100/70 text-rose-600 flex items-center justify-center mb-2">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#172B4D]">24/7 Support</h4>
                  <p className="text-[11px] text-[#687B94] leading-tight">We're here to help</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual & Interactive Login Card */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* House holding visual with handwritten quote */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white to-[#F4F8FC] border border-[#DFE7F0] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#5145CD]/10 text-[#5145CD] flex items-center justify-center">
                      <Home className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#12365A]">Housing & Personal Loans</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#159A78] bg-[#E7F7F0] px-2 py-0.5 rounded-full">
                    Low 10.5% Rates
                  </span>
                </div>

                <div className="text-center py-4">
                  <p className="font-serif italic text-lg text-[#12365A] mb-1">
                    “Build Your Future With Us ♡”
                  </p>
                  <p className="text-xs text-[#687B94]">
                    Transparent financing designed for your family's aspirations.
                  </p>
                </div>
              </div>

              {/* Quick Login Card (as seen in Reference Image 1 top right of hero) */}
              <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-md">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#172B4D]">Welcome Back!</h3>
                  <p className="text-xs text-[#687B94]">Login to access your account</p>
                </div>

                {loginError && (
                  <div className="mb-3 p-2.5 bg-[#FFF0F1] border border-[#DC5263]/30 rounded-lg text-xs text-[#9b2130]">
                    {loginError}
                  </div>
                )}

                <form onSubmit={handleHeroLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                      Email or Username
                    </label>
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. priya or admin"
                      required
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-[#172B4D]">Password</label>
                      <Link to="/forgot-password" className="text-[11px] text-[#5145CD] hover:underline">
                        Forgot?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-2.5 bg-[#5145CD] hover:bg-[#4036B5] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    {loginLoading ? 'Authenticating...' : 'Login'}
                  </button>

                  <div className="text-center pt-1">
                    <span className="text-xs text-[#687B94]">Don't have an account? </span>
                    <Link to="/register" className="text-xs font-semibold text-[#5145CD] hover:underline">
                      Register
                    </Link>
                  </div>

                  {/* Demo Credential Hint */}
                  <div className="p-2.5 bg-[#F4F8FC] rounded-lg border border-[#DFE7F0] text-[11px] text-[#687B94] flex items-center justify-between">
                    <span>Demo Customer: <strong>priya</strong></span>
                    <span>Admin: <strong>admin</strong></span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white py-6 border-b border-[#DFE7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#172B4D]">
              <CheckCircle2 className="w-4 h-4 text-[#159A78]" />
              <span>Transparent Repayment Schedules</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#172B4D]">
              <CheckCircle2 className="w-4 h-4 text-[#159A78]" />
              <span>Clear Loan Information</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#172B4D]">
              <CheckCircle2 className="w-4 h-4 text-[#159A78]" />
              <span>Secure Account Access</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#172B4D]">
              <CheckCircle2 className="w-4 h-4 text-[#159A78]" />
              <span>Easy Payment Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-[#F4F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
              About LoanEase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12365A]">
              Financial management made simpler.
            </h2>
            <p className="text-sm sm:text-base text-[#687B94] leading-relaxed">
              LoanEase was engineered from the ground up to replace confusing paperwork and hidden calculations.
              We provide clear monthly breakdowns, accurate reducing-balance calculations, and real-time payment visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-[#DFE7F0] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2588D8] flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B4D] mb-2">Digital Loan Applications</h3>
              <p className="text-xs text-[#687B94] leading-relaxed">
                Submit requests in minutes without cumbersome visits. Track eligibility, review status, and receive approved funds with complete audit trails.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DFE7F0] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#E7F7F0] text-[#159A78] flex items-center justify-center mb-4">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B4D] mb-2">Reducing-Balance EMI Math</h3>
              <p className="text-xs text-[#687B94] leading-relaxed">
                Know exactly where every rupee goes. Transparent separation of principal and interest components with zero guesswork or undisclosed charges.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DFE7F0] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#5145CD] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B4D] mb-2">Enterprise Security</h3>
              <p className="text-xs text-[#687B94] leading-relaxed">
                Role-based access control, cryptographic password hashing, and encrypted financial statements ensure complete privacy for customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white border-y border-[#DFE7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
              Comprehensive Services
            </span>
            <h2 className="text-3xl font-extrabold text-[#12365A]">
              Everything you need to manage credit
            </h2>
            <p className="text-xs sm:text-sm text-[#687B94]">
              Four dedicated functional pillars covering your entire loan lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1 */}
            <div className="bg-[#F4F8FC] rounded-2xl p-6 border border-[#DFE7F0] flex flex-col justify-between hover:border-[#5145CD]/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#172B4D] mb-1">1. Loan Management</h3>
                <p className="text-xs text-[#687B94] leading-relaxed mt-2">
                  Apply for Personal, Home, Vehicle, and Business loans. Real-time approval updates and document storage.
                </p>
              </div>
              <Link to="/loans" className="mt-6 inline-flex items-center text-xs font-bold text-[#5145CD] hover:underline gap-1">
                Explore Loans <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 2 */}
            <div className="bg-[#F4F8FC] rounded-2xl p-6 border border-[#DFE7F0] flex flex-col justify-between hover:border-[#5145CD]/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-[#5145CD] flex items-center justify-center mb-4">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#172B4D] mb-1">2. EMI Calculator</h3>
                <p className="text-xs text-[#687B94] leading-relaxed mt-2">
                  Estimate instalments and total repayments with precision before applying. Test multiple tenure scenarios.
                </p>
              </div>
              <a href="#calculator" className="mt-6 inline-flex items-center text-xs font-bold text-[#5145CD] hover:underline gap-1">
                Try Calculator <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Service 3 */}
            <div className="bg-[#F4F8FC] rounded-2xl p-6 border border-[#DFE7F0] flex flex-col justify-between hover:border-[#5145CD]/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#E7F7F0] text-[#159A78] flex items-center justify-center mb-4">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#172B4D] mb-1">3. Payment Tracking</h3>
                <p className="text-xs text-[#687B94] leading-relaxed mt-2">
                  Instant receipts for UPI, Net Banking, and card settlements. Due date reminders and ledger reconciliation.
                </p>
              </div>
              <Link to="/payments" className="mt-6 inline-flex items-center text-xs font-bold text-[#5145CD] hover:underline gap-1">
                View Payments <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Service 4 */}
            <div className="bg-[#F4F8FC] rounded-2xl p-6 border border-[#DFE7F0] flex flex-col justify-between hover:border-[#5145CD]/40 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#172B4D] mb-1">4. Financial Reports</h3>
                <p className="text-xs text-[#687B94] leading-relaxed mt-2">
                  Comprehensive statement generation, interest certificates for tax deductions, and repayment analytics.
                </p>
              </div>
              <Link to="/dashboard" className="mt-6 inline-flex items-center text-xs font-bold text-[#5145CD] hover:underline gap-1">
                Open Dashboard <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#F4F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-[#12365A]">
              How LoanEase Works
            </h2>
            <p className="text-xs sm:text-sm text-[#687B94]">
              From signup to final repayment, your path is straightforward and transparent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="bg-white rounded-2xl p-6 border border-[#DFE7F0] relative shadow-xs">
              <span className="w-8 h-8 rounded-full bg-[#5145CD] text-white font-bold text-xs flex items-center justify-center mb-4">
                1
              </span>
              <h4 className="text-sm font-bold text-[#172B4D] mb-1">Create Your Account</h4>
              <p className="text-xs text-[#687B94] leading-relaxed">
                Sign up in under 60 seconds with your email and phone. Instant verification without branch visits.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DFE7F0] relative shadow-xs">
              <span className="w-8 h-8 rounded-full bg-[#5145CD] text-white font-bold text-xs flex items-center justify-center mb-4">
                2
              </span>
              <h4 className="text-sm font-bold text-[#172B4D] mb-1">Submit Loan Application</h4>
              <p className="text-xs text-[#687B94] leading-relaxed">
                Choose loan type, select requested amount, and set desired tenure with immediate EMI estimates.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DFE7F0] relative shadow-xs">
              <span className="w-8 h-8 rounded-full bg-[#5145CD] text-white font-bold text-xs flex items-center justify-center mb-4">
                3
              </span>
              <h4 className="text-sm font-bold text-[#172B4D] mb-1">Track Approval & Terms</h4>
              <p className="text-xs text-[#687B94] leading-relaxed">
                Monitor credit appraisal in real time. Once approved, review your sanction letter and repayment schedule.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#DFE7F0] relative shadow-xs">
              <span className="w-8 h-8 rounded-full bg-[#5145CD] text-white font-bold text-xs flex items-center justify-center mb-4">
                4
              </span>
              <h4 className="text-sm font-bold text-[#172B4D] mb-1">Manage EMIs & Payments</h4>
              <p className="text-xs text-[#687B94] leading-relaxed">
                Settle monthly dues via UPI or Net Banking with instant downloadable receipts and updated balances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive EMI Calculator Section */}
      <section id="calculator" className="py-20 bg-white border-t border-[#DFE7F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5145CD]">
              Live Financial Tool
            </span>
            <h2 className="text-3xl font-extrabold text-[#12365A]">
              Calculate Your Monthly EMI
            </h2>
            <p className="text-xs sm:text-sm text-[#687B94]">
              Accurate reducing-balance estimation. Adjust the principal, rate, and tenure below.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-[#F4F8FC] rounded-3xl border border-[#DFE7F0] p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders & Inputs */}
              <div className="lg:col-span-7 space-y-6">
                {/* Loan Amount */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-[#172B4D]">Loan Amount (INR)</label>
                    <span className="font-bold text-[#5145CD] tabular-nums text-sm">
                      {formatINR(calcAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={20000}
                    max={2000000}
                    step={10000}
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5145CD]"
                  />
                  <div className="flex justify-between text-[11px] text-[#687B94]">
                    <span>₹20,000</span>
                    <span>₹20,00,000</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-[#172B4D]">Annual Interest Rate (%)</label>
                    <span className="font-bold text-[#5145CD] tabular-nums text-sm">
                      {calcRate}% p.a.
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={24}
                    step={0.5}
                    value={calcRate}
                    onChange={(e) => setCalcRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5145CD]"
                  />
                  <div className="flex justify-between text-[11px] text-[#687B94]">
                    <span>6%</span>
                    <span>24%</span>
                  </div>
                </div>

                {/* Tenure */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-semibold text-[#172B4D]">Loan Tenure (Months)</label>
                    <span className="font-bold text-[#5145CD] tabular-nums text-sm">
                      {calcTenure} months ({Math.round((calcTenure / 12) * 10) / 10} yrs)
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={60}
                    step={3}
                    value={calcTenure}
                    onChange={(e) => setCalcTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5145CD]"
                  />
                  <div className="flex justify-between text-[11px] text-[#687B94]">
                    <span>6 months</span>
                    <span>60 months</span>
                  </div>
                </div>
              </div>

              {/* Result Summary Box */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-sm space-y-4">
                <div className="p-4 bg-[#5145CD]/5 rounded-xl border border-[#5145CD]/20 text-center">
                  <span className="text-xs font-semibold text-[#687B94] uppercase tracking-wider block">
                    Estimated Monthly EMI
                  </span>
                  <span className="text-3xl font-extrabold text-[#5145CD] tabular-nums mt-1 block">
                    {formatINR(emiResult.monthlyEmi)}
                  </span>
                  <span className="text-[11px] text-[#687B94] mt-1 block">
                    per month for {calcTenure} instalments
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#687B94]">Principal Amount</span>
                    <span className="font-bold text-[#172B4D] tabular-nums">{formatINR(calcAmount)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#687B94]">Total Interest Payable</span>
                    <span className="font-bold text-[#E7A23B] tabular-nums">{formatINR(emiResult.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#172B4D] font-semibold">Total Repayment Amount</span>
                    <span className="font-bold text-[#159A78] text-sm tabular-nums">{formatINR(emiResult.totalRepayment)}</span>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="w-full py-2.5 bg-[#12365A] hover:bg-[#0B2442] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Apply with These Terms</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <p className="text-[10px] text-center text-[#687B94]">
                  * Illustrative estimate based on reducing balance. Actual terms finalized during approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="py-20 bg-[#12365A] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Take the next step toward your financial goals.
          </h2>
          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Keep your loan details, repayment schedule, and payment history organized in one place.
            Join thousands of satisfied borrowers today.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="px-6 py-3.5 bg-[#5145CD] hover:bg-[#4036B5] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
