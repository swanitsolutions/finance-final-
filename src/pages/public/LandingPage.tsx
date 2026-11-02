import React, { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { calculateEMI } from '../../lib/calculations/emi';
import { formatINR } from '../../lib/formatters/currency';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Calculator,
  CheckCircle2,
  FileText,
  CreditCard,
  BarChart3,
  ChevronRight,
  Home,
  HelpCircle,
  TrendingUp,
  Percent,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  // Interactive EMI Calculator State
  const [calcAmount, setCalcAmount] = useState<number>(200000);
  const [calcRate, setCalcRate] = useState<number>(12);
  const [calcTenure, setCalcTenure] = useState<number>(24);

  const emiResult = calculateEMI(calcAmount, calcRate, calcTenure);

  return (
    <div className="min-h-screen bg-[#F3F5F6] flex flex-col font-sans text-[#172B3A]">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden border-b border-[#DFE5E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DFE5E9] shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#218568]" />
                <span className="text-xs font-semibold text-[#153755] tracking-wide">
                  Secure • Simple • Trusted
                </span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#153755] tracking-tight leading-[1.15]">
                  Your Financial <br />
                  Goals, <span className="text-[#612536]">Our Priority</span>
                </h1>
                <p className="text-base sm:text-lg text-[#536473] max-w-xl leading-relaxed">
                  Apply for loans, track your EMIs, and manage your finances all in one place. Fast, secure, and transparent reducing-balance repayment schedules.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#calculator"
                  className="px-6 py-3.5 bg-[#612536] hover:bg-[#4C1C2B] text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>Calculate EMI</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 bg-white hover:bg-gray-50 text-[#153755] border border-[#DFE5E9] rounded-xl text-sm font-semibold transition-colors shadow-2xs"
                >
                  Learn More
                </a>
              </div>

              {/* 4 Feature Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#DFE5E9]">
                <div className="space-y-1">
                  <div className="w-9 h-9 rounded-lg bg-[#0D343B]/10 text-[#0D343B] flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#172B3A]">Quick Loan Approval</h4>
                  <p className="text-[11px] text-[#7B8994] leading-tight">Get your loan in less time</p>
                </div>

                <div className="space-y-1">
                  <div className="w-9 h-9 rounded-lg bg-[#612536]/10 text-[#612536] flex items-center justify-center mb-2">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#172B3A]">Easy EMI Tracking</h4>
                  <p className="text-[11px] text-[#7B8994] leading-tight">Never miss a due date</p>
                </div>

                <div className="space-y-1">
                  <div className="w-9 h-9 rounded-lg bg-[#E6F4EE] text-[#218568] flex items-center justify-center mb-2">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#172B3A]">Secure & Reliable</h4>
                  <p className="text-[11px] text-[#7B8994] leading-tight">Your data is always safe</p>
                </div>

                <div className="space-y-1">
                  <div className="w-9 h-9 rounded-lg bg-[#E65327]/10 text-[#E65327] flex items-center justify-center mb-2">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#172B3A]">24/7 Support</h4>
                  <p className="text-[11px] text-[#7B8994] leading-tight">We're here to help</p>
                </div>
              </div>
            </div>

            {/* Right Column: Financial Overview Showcase */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* House holding visual with quote */}
              <div className="relative rounded-2xl overflow-hidden bg-white border border-[#DFE5E9] p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0D343B]/10 text-[#0D343B] flex items-center justify-center">
                      <Home className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#153755]">Housing & Personal Loans</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#218568] bg-[#E6F4EE] px-2 py-0.5 rounded-full">
                    Low 9.5% Rates
                  </span>
                </div>

                <div className="text-center py-4">
                  <p className="font-serif italic text-lg text-[#612536] mb-1 font-semibold">
                    “Build Your Future With Us ♡”
                  </p>
                  <p className="text-xs text-[#536473]">
                    Transparent financing designed for your family's aspirations.
                  </p>
                </div>
              </div>

              {/* Competitive Interest Rates Showcase Card */}
              <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DFE5E9]">
                  <div>
                    <h3 className="text-base font-bold text-[#172B3A]">Transparent Loan Rates</h3>
                    <p className="text-[11px] text-[#7B8994]">Real-time reducing balance terms</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#218568] bg-[#E6F4EE] px-2.5 py-1 rounded-lg">
                    Zero Hidden Fees
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F8FA] border border-[#DFE5E9]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#0D343B] text-white flex items-center justify-center text-xs font-bold">
                        HL
                      </div>
                      <div>
                        <p className="font-bold text-[#172B3A]">Home Loan</p>
                        <p className="text-[10px] text-[#7B8994]">Tenure up to 30 yrs</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0D343B]">8.50% - 9.75%</p>
                      <p className="text-[10px] text-[#218568]">Instant approval</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F8FA] border border-[#DFE5E9]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#612536] text-white flex items-center justify-center text-xs font-bold">
                        PL
                      </div>
                      <div>
                        <p className="font-bold text-[#172B3A]">Personal Loan</p>
                        <p className="text-[10px] text-[#7B8994]">Flexible tenures</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#612536]">10.50% - 13.00%</p>
                      <p className="text-[10px] text-[#218568]">Fast disbursal</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F8FA] border border-[#DFE5E9]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#6B751B] text-white flex items-center justify-center text-xs font-bold">
                        BL
                      </div>
                      <div>
                        <p className="font-bold text-[#172B3A]">Business Finance</p>
                        <p className="text-[10px] text-[#7B8994]">Working capital</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#6B751B]">11.00% - 14.50%</p>
                      <p className="text-[10px] text-[#218568]">Custom schedule</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center text-xs text-[#536473] bg-[#EDF2F5] p-3 rounded-xl border border-[#DFE5E9]">
                  <span>Sign in or create an account using </span>
                  <strong className="text-[#172B3A]">Login</strong> or <strong className="text-[#612536]">Register</strong>
                  <span> in the top navigation bar.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white py-6 border-b border-[#DFE5E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#172B3A]">
              <CheckCircle2 className="w-4 h-4 text-[#218568]" />
              <span>Transparent Repayment Schedules</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#172B3A]">
              <CheckCircle2 className="w-4 h-4 text-[#218568]" />
              <span>Clear Loan Information</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#172B3A]">
              <CheckCircle2 className="w-4 h-4 text-[#218568]" />
              <span>Secure Account Access</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#172B3A]">
              <CheckCircle2 className="w-4 h-4 text-[#218568]" />
              <span>Dedicated Customer Assistance</span>
            </div>
          </div>
        </div>
      </section>

      {/* About LoanEase Section */}
      <section id="about" className="py-20 bg-white border-b border-[#DFE5E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-5">
              <div className="relative bg-[#EDF2F5] p-8 rounded-3xl border border-[#DFE5E9] space-y-6">
                <div className="inline-block px-3 py-1 bg-[#612536] text-white rounded-lg text-xs font-semibold">
                  About LoanEase
                </div>

                <h3 className="text-2xl font-bold text-[#153755] leading-snug">
                  Transforming the loan experience through clarity, technology, and trust.
                </h3>

                <p className="text-xs text-[#536473] leading-relaxed">
                  Founded with a vision to eliminate the ambiguity and stress around loan management, LoanEase gives borrowers direct clarity into reducing balance interest, amortization schedules, and real-time payment records.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#DFE5E9]">
                  <div className="bg-white p-4 rounded-2xl border border-[#DFE5E9]">
                    <div className="text-2xl font-bold text-[#0D343B] tabular-nums">99.8%</div>
                    <div className="text-xs text-[#7B8994] mt-0.5">Calculation Precision</div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-[#DFE5E9]">
                    <div className="text-2xl font-bold text-[#6B751B] tabular-nums">₹ 48.5L+</div>
                    <div className="text-xs text-[#7B8994] mt-0.5">Loans Administered</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#612536]">
                Our Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B3A] tracking-tight">
                Designed for borrowers who value transparency.
              </h2>
              <p className="text-sm text-[#536473] leading-relaxed">
                Traditional lending often obscures how each monthly payment breaks down between principal reduction and accrued interest. LoanEase calculates reducing-balance schedules with complete mathematical accuracy and provides immediate payment confirmations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-[#F5F8FA] rounded-2xl border border-[#DFE5E9] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0D343B]/10 text-[#0D343B] flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#172B3A]">Transparent Amortization</h4>
                  <p className="text-xs text-[#536473] leading-relaxed">
                    View exact breakdowns for every month with transparent principal balance updates.
                  </p>
                </div>

                <div className="p-4 bg-[#F5F8FA] rounded-2xl border border-[#DFE5E9] space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-[#6B751B]/10 text-[#6B751B] flex items-center justify-center">
                    <Percent className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-[#172B3A]">Competitive Terms</h4>
                  <p className="text-xs text-[#536473] leading-relaxed">
                    Multiple financing tiers tailored to personal, business, and housing needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-[#F5F8FA] border-b border-[#DFE5E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#612536]">
              Our Financial Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B3A] tracking-tight">
              Tailored Financial Solutions for Every Milestone
            </h2>
            <p className="text-sm text-[#536473]">
              Whether buying a home, growing a venture, or pursuing education, LoanEase provides simple, structured borrowing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#DFE5E9] shadow-2xs space-y-4 hover:border-[#612536]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#0D343B]/10 text-[#0D343B] flex items-center justify-center">
                <Home className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B3A]">Home Loans</h3>
              <p className="text-xs text-[#536473] leading-relaxed">
                Competitive long-term home financing with rates starting from 8.5% p.a. and tenures up to 30 years.
              </p>
              <ul className="space-y-1.5 text-xs text-[#536473] pt-2 border-t border-gray-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#218568]" />
                  <span>Up to ₹ 50,00,000 financing</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#218568]" />
                  <span>Zero prepayment penalty</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#DFE5E9] shadow-2xs space-y-4 hover:border-[#612536]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#612536]/10 text-[#612536] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B3A]">Personal Loans</h3>
              <p className="text-xs text-[#536473] leading-relaxed">
                Quick disbursal loans for life events, medical emergencies, or renovations with minimal paperwork.
              </p>
              <ul className="space-y-1.5 text-xs text-[#536473] pt-2 border-t border-gray-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#218568]" />
                  <span>Disbursal within 24 hours</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#218568]" />
                  <span>Tenures from 12 to 60 months</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#DFE5E9] shadow-2xs space-y-4 hover:border-[#612536]/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#6B751B]/10 text-[#6B751B] flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#172B3A]">Business Loans</h3>
              <p className="text-xs text-[#536473] leading-relaxed">
                Capital to expand operations, purchase equipment, or manage cash flows with custom repayment schedules.
              </p>
              <ul className="space-y-1.5 text-xs text-[#536473] pt-2 border-t border-gray-100">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#218568]" />
                  <span>Flexible collateral terms</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#218568]" />
                  <span>Structured balloon or seasonal EMIs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-[#DFE5E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#612536]">
              Simple & Streamlined
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B3A] tracking-tight">
              How LoanEase Works
            </h2>
            <p className="text-sm text-[#536473]">
              From calculation to final payment, managing your borrowing requires just four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#F5F8FA] rounded-2xl border border-[#DFE5E9] space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-[#612536] text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h4 className="text-sm font-bold text-[#172B3A]">Calculate Your EMI</h4>
              <p className="text-xs text-[#536473] leading-relaxed">
                Use our interactive reducing balance calculator below to test tenures and interest rates.
              </p>
            </div>

            <div className="p-6 bg-[#F5F8FA] rounded-2xl border border-[#DFE5E9] space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-[#0D343B] text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h4 className="text-sm font-bold text-[#172B3A]">Register Your Account</h4>
              <p className="text-xs text-[#536473] leading-relaxed">
                Click Register in the top navigation bar with verified password security checks.
              </p>
            </div>

            <div className="p-6 bg-[#F5F8FA] rounded-2xl border border-[#DFE5E9] space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-[#6B751B] text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h4 className="text-sm font-bold text-[#172B3A]">Underwriting Review</h4>
              <p className="text-xs text-[#536473] leading-relaxed">
                Our underwriting team reviews your credit score and generates your amortization schedule.
              </p>
            </div>

            <div className="p-6 bg-[#F5F8FA] rounded-2xl border border-[#DFE5E9] space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-[#E65327] text-white flex items-center justify-center text-xs font-bold">
                4
              </div>
              <h4 className="text-sm font-bold text-[#172B3A]">Automated Tracking</h4>
              <p className="text-xs text-[#536473] leading-relaxed">
                Pay EMIs online, generate receipts, and track remaining principal balance in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EMI Calculator Section */}
      <section id="calculator" className="py-20 bg-[#F5F8FA] border-b border-[#DFE5E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#612536]">
              Interactive Estimator
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172B3A] tracking-tight">
              Calculate Your Monthly EMI
            </h2>
            <p className="text-sm text-[#536473]">
              Plan your finances accurately using reducing-balance formula: EMI = [P × r × (1+r)ⁿ] / [(1+r)ⁿ - 1].
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-[#DFE5E9] shadow-sm p-6 sm:p-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders Column (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-[#172B3A]">Loan Principal Amount</label>
                    <span className="text-sm font-bold text-[#153755] tabular-nums">{formatINR(calcAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="2000000"
                    step="10000"
                    value={calcAmount}
                    onChange={(e) => setCalcAmount(Number(e.target.value))}
                    className="w-full accent-[#612536] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#7B8994] mt-1">
                    <span>₹10,000</span>
                    <span>₹20,00,000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-[#172B3A]">Annual Interest Rate</label>
                    <span className="text-sm font-bold text-[#153755] tabular-nums">{calcRate}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    step="0.5"
                    value={calcRate}
                    onChange={(e) => setCalcRate(Number(e.target.value))}
                    className="w-full accent-[#612536] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#7B8994] mt-1">
                    <span>5%</span>
                    <span>25%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-[#172B3A]">Loan Tenure</label>
                    <span className="text-sm font-bold text-[#153755] tabular-nums">{calcTenure} Months</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="120"
                    step="6"
                    value={calcTenure}
                    onChange={(e) => setCalcTenure(Number(e.target.value))}
                    className="w-full accent-[#612536] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#7B8994] mt-1">
                    <span>6 Mo</span>
                    <span>120 Mo (10 Yrs)</span>
                  </div>
                </div>
              </div>

              {/* Result Summary Card (5 cols) */}
              <div className="lg:col-span-5 bg-[#EDF2F5] p-6 rounded-2xl border border-[#DFE5E9] space-y-4">
                <div className="text-center p-4 bg-[#0D343B] text-white rounded-xl shadow-xs">
                  <span className="text-[11px] uppercase tracking-wider text-white/80 font-semibold block">
                    Calculated Monthly EMI
                  </span>
                  <span className="text-3xl font-extrabold text-[#E8EA68] mt-1 block tabular-nums">
                    {formatINR(emiResult.monthlyEmi)}
                  </span>
                  <span className="text-[11px] text-white/75 mt-1 block">
                    per month for {calcTenure} instalments
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#536473]">Principal Amount</span>
                    <span className="font-bold text-[#172B3A] tabular-nums">{formatINR(calcAmount)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#536473]">Total Interest Payable</span>
                    <span className="font-bold text-[#E65327] tabular-nums">{formatINR(emiResult.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#172B3A] font-semibold">Total Repayment Amount</span>
                    <span className="font-bold text-[#6B751B] text-sm tabular-nums">{formatINR(emiResult.totalRepayment)}</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#DFE5E9] text-center text-xs text-[#536473]">
                  <span>Ready to apply? Use </span>
                  <strong className="text-[#612536]">Register</strong>
                  <span> in the top navigation bar to begin.</span>
                </div>

                <p className="text-[10px] text-center text-[#7B8994]">
                  * Illustrative estimate based on reducing balance. Actual terms finalized during approval.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call To Action */}
      <section className="py-20 bg-[#153755] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Take the next step toward your financial goals.
          </h2>
          <p className="text-sm sm:text-base text-[#D9E0E5] max-w-2xl mx-auto leading-relaxed">
            Keep your loan details, repayment schedule, and payment history organized in one place.
            Join thousands of satisfied borrowers today.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#calculator"
              className="px-6 py-3.5 bg-[#612536] hover:bg-[#4C1C2B] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer"
            >
              Explore Loan Calculator
            </a>
            <a
              href="#how-it-works"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Learn How It Works
            </a>
          </div>

          <div className="pt-2 text-xs text-[#D9E0E5]/80">
            <span>To access or create your account, use </span>
            <strong className="text-white">Login</strong> or <strong className="text-[#E8EA68]">Register</strong>
            <span> in the navigation bar above.</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
