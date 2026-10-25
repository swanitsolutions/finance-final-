import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api/apiClient';
import { Loan, PaymentTransaction, EMIScheduleItem, FinancialSummary } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters/currency';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PaymentModal } from '../../components/modals/PaymentModal';
import {
  FileText,
  CheckCircle2,
  Receipt,
  AlertCircle,
  PlusCircle,
  CalendarDays,
  CreditCard,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [primaryLoan, setPrimaryLoan] = useState<Loan | null>(null);
  const [allLoans, setAllLoans] = useState<Loan[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<PaymentTransaction[]>([]);
  const [upcomingScheduleItem, setUpcomingScheduleItem] = useState<EMIScheduleItem | undefined>();

  // Payment modal state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    const res = await apiClient.getCustomerDashboard(user.id);
    setIsLoading(false);

    if (res.success && res.data) {
      setSummary(res.data.summary);
      setPrimaryLoan(res.data.primaryLoan || null);
      setAllLoans(res.data.loans);
      setRecentTransactions(res.data.recentTransactions);
      setUpcomingScheduleItem(res.data.upcomingScheduleItem);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Doughnut chart data
  const paidAmount = primaryLoan?.paidAmount || 60000;
  const remainingAmount = primaryLoan?.remainingAmount || 140000;
  const totalAmount = primaryLoan?.totalRepayment || (paidAmount + remainingAmount);
  const paidPercentage = Math.round((paidAmount / (totalAmount || 1)) * 100);

  const chartData = [
    { name: 'Paid', value: paidAmount, color: '#159A78' },
    { name: 'Remaining', value: remainingAmount, color: '#2588D8' },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Top Metric Cards (matches Reference Image 1 top right) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Loans"
          value={summary?.totalLoans ?? 1}
          subtitle="Active Loan"
          icon={<FileText className="w-6 h-6" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <MetricCard
          title="Total Loan Amount"
          value={formatINR(summary?.totalLoanAmount ?? 200000)}
          subtitle="Approved Amount"
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconBgColor="bg-[#E7F7F0]"
          iconColor="text-[#159A78]"
        />

        <MetricCard
          title="Total Paid"
          value={formatINR(summary?.totalPaid ?? 60000)}
          subtitle="Paid Amount"
          icon={<Receipt className="w-6 h-6" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />

        <MetricCard
          title="Remaining Amount"
          value={formatINR(summary?.remainingAmount ?? 140000)}
          subtitle="Pending Amount"
          icon={<AlertCircle className="w-6 h-6" />}
          iconBgColor="bg-[#FFF0F1]"
          iconColor="text-[#DC5263]"
        />
      </div>

      {/* Main Grid: My Loan Details + Repayment Progress + Quick Actions Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Columns: Details, Chart, Transactions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Middle Row: Loan Details & Doughnut Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Loan Details Card */}
            <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-[#172B4D]">My Loan Details</h3>
                  <StatusBadge status={primaryLoan?.status || 'Active'} size="sm" />
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#687B94]">Loan ID</span>
                    <span className="font-mono font-bold text-[#172B4D]">
                      {primaryLoan?.id || 'LN123456'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#687B94]">Loan Amount</span>
                    <span className="font-bold text-[#172B4D] tabular-nums">
                      {formatINR(primaryLoan?.principalAmount || 200000)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#687B94]">Interest Rate</span>
                    <span className="font-semibold text-[#172B4D]">
                      {primaryLoan?.annualInterestRate || 12}% (per annum)
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#687B94]">Loan Tenure</span>
                    <span className="font-semibold text-[#172B4D]">
                      {primaryLoan?.tenureMonths || 24} months
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#687B94]">Monthly EMI</span>
                    <span className="font-bold text-[#5145CD] tabular-nums">
                      {formatINR(primaryLoan?.monthlyEmi || 9347)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#687B94]">Next Due Date</span>
                    <span className="font-bold text-[#E7A23B]">
                      {formatDate(primaryLoan?.nextDueDate || '2024-11-10')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <Link
                  to="/loans"
                  className="w-full py-2 bg-[#5145CD] hover:bg-[#4036B5] text-white text-xs font-semibold rounded-xl text-center block transition-colors shadow-xs"
                >
                  View All Loans
                </Link>
              </div>
            </div>

            {/* Repayment Progress Doughnut Chart Card */}
            <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#172B4D] mb-2">Repayment Progress</h3>

                <div className="relative h-44 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [formatINR(Number(val)), '']}
                        contentStyle={{
                          backgroundColor: '#12365A',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Centered Percentage */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-[#172B4D] tabular-nums">
                      {paidPercentage}%
                    </span>
                    <span className="text-[11px] font-semibold text-[#687B94]">Paid</span>
                  </div>
                </div>
              </div>

              {/* Legend with matching breakdown */}
              <div className="space-y-1.5 text-xs pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#159A78]" />
                    <span className="text-[#687B94]">Paid</span>
                  </div>
                  <span className="font-bold text-[#172B4D] tabular-nums">{formatINR(paidAmount)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2588D8]" />
                    <span className="text-[#687B94]">Remaining</span>
                  </div>
                  <span className="font-bold text-[#172B4D] tabular-nums">{formatINR(remainingAmount)}</span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-gray-100 text-[#172B4D] font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    <span>Total</span>
                  </div>
                  <span className="tabular-nums">{formatINR(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions List Card */}
          <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#172B4D]">Recent Transactions</h3>
              <Link
                to="/payments/history"
                className="text-xs font-semibold text-[#5145CD] hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {recentTransactions.map((txn) => {
                const isDisbursal = txn.description.toLowerCase().includes('disbursal');
                return (
                  <div key={txn.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDisbursal
                            ? 'bg-rose-100 text-rose-600'
                            : 'bg-[#E7F7F0] text-[#159A78]'
                        }`}
                      >
                        {isDisbursal ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <Receipt className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#172B4D]">{txn.description}</p>
                        <p className="text-[11px] text-[#687B94]">
                          {formatDate(txn.paymentDate)} • via {txn.paymentMethod}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-xs font-bold tabular-nums ${
                          isDisbursal ? 'text-[#DC5263]' : 'text-[#159A78]'
                        }`}
                      >
                        {isDisbursal ? '+' : ''}
                        {formatINR(txn.amount)}
                      </p>
                      <span className="text-[10px] text-gray-400 font-mono">{txn.id}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Contextual Quick Actions Panel (matches Reference Image 1) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Top Inspirational Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl p-4 border border-[#DFE7F0] text-center">
            <p className="font-serif italic text-xs text-[#12365A]">
              “Every step you take brings you closer to your dreams ♡”
            </p>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#172B4D]">Quick Actions</h3>

            <div className="space-y-3">
              {/* Apply for Loan */}
              <button
                onClick={() => navigate('/loans/apply')}
                className="w-full p-3.5 rounded-xl bg-[#5145CD] hover:bg-[#4036B5] text-white flex items-center gap-3 transition-colors shadow-xs text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Apply for Loan</p>
                  <p className="text-[10px] text-white/80">Submit a new financing application</p>
                </div>
              </button>

              {/* View EMI Schedule */}
              <button
                onClick={() => navigate('/emi-schedule')}
                className="w-full p-3.5 rounded-xl bg-[#2588D8] hover:bg-[#1d74bb] text-white flex items-center gap-3 transition-colors shadow-xs text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">View EMI Schedule</p>
                  <p className="text-[10px] text-white/80">Check all upcoming instalment dates</p>
                </div>
              </button>

              {/* Make Payment */}
              <button
                onClick={() => setPaymentModalOpen(true)}
                className="w-full p-3.5 rounded-xl bg-[#159A78] hover:bg-[#0f7a5e] text-white flex items-center gap-3 transition-colors shadow-xs text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Make Payment</p>
                  <p className="text-[10px] text-white/80">Pay pending EMI via UPI or Net Banking</p>
                </div>
              </button>

              {/* Contact Support */}
              <button
                onClick={() => navigate('/support')}
                className="w-full p-3.5 rounded-xl bg-[#E7A23B] hover:bg-[#cb8b2c] text-white flex items-center gap-3 transition-colors shadow-xs text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Contact Support</p>
                  <p className="text-[10px] text-white/80">Ask questions or report an issue</p>
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Motivation Card */}
          <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs text-center space-y-3">
            <div className="w-12 h-12 bg-indigo-50 text-[#5145CD] rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="font-serif italic text-sm text-[#12365A]">
                “Small steps today, <br />
                big dreams tomorrow. ♥”
              </p>
              <p className="text-[11px] text-[#687B94] mt-2">
                Timely EMI repayments build your credit score up to 800+.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {primaryLoan && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          loanId={primaryLoan.id}
          instalmentNumber={upcomingScheduleItem?.instalmentNumber || 4}
          amount={primaryLoan.monthlyEmi}
          customerName={user?.fullName || 'Priya Sharma'}
          customerId={user?.id || 'USR-001'}
          onPaymentSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};
