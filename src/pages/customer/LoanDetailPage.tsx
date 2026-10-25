import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api/apiClient';
import { Loan, EMIScheduleItem } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters/currency';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PaymentModal } from '../../components/modals/PaymentModal';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Printer,
  FileCheck2,
  AlertCircle,
  Clock,
  Percent,
} from 'lucide-react';

export const LoanDetailPage: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [schedule, setSchedule] = useState<EMIScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInstalment, setSelectedInstalment] = useState<EMIScheduleItem | null>(null);

  const fetchLoanData = async () => {
    if (!loanId) return;
    setLoading(true);
    const [loanRes, schedRes] = await Promise.all([
      apiClient.getLoanById(loanId),
      apiClient.getLoanSchedule(loanId),
    ]);
    setLoading(false);

    if (loanRes.success && loanRes.data) {
      setLoan(loanRes.data);
    }
    if (schedRes.success && schedRes.data) {
      setSchedule(schedRes.data);
    }
  };

  useEffect(() => {
    fetchLoanData();
  }, [loanId]);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-[#687B94]">
        Loading loan details and schedule...
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="bg-white rounded-2xl border border-[#DFE7F0] p-12 text-center max-w-md mx-auto space-y-4">
        <AlertCircle className="w-10 h-10 text-[#DC5263] mx-auto" />
        <h3 className="text-base font-bold text-[#172B4D]">Loan Not Found</h3>
        <p className="text-xs text-[#687B94]">The requested loan record does not exist or has been archived.</p>
        <Link to="/loans" className="inline-block px-4 py-2 bg-[#5145CD] text-white text-xs font-semibold rounded-xl">
          Back to My Loans
        </Link>
      </div>
    );
  }

  const nextUnpaidItem = schedule.find((s) => s.status !== 'paid');

  const filteredSchedule = schedule.filter((item) => {
    if (scheduleFilter === 'paid') return item.status === 'paid';
    if (scheduleFilter === 'pending') return item.status !== 'paid';
    return true;
  });

  const progressPercent = Math.min(
    100,
    Math.round((loan.paidAmount / (loan.totalRepayment || 1)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/loans"
            className="p-2 bg-white rounded-xl border border-[#DFE5E9] hover:bg-[#F3F5F6] text-[#172B3A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#172B3A]">Loan {loan.id}</h2>
              <StatusBadge status={loan.status} size="sm" />
            </div>
            <p className="text-xs text-[#536473] mt-0.5">
              {loan.loanType} Financing • Disbursed {formatDate(loan.disbursementDate || loan.applicationDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white border border-[#DFE5E9] hover:bg-[#F3F5F6] rounded-xl text-xs font-semibold text-[#172B3A] flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#7B8994]" />
            <span>Print Schedule</span>
          </button>

          {loan.status === 'active' && nextUnpaidItem && (
            <button
              onClick={() => {
                setSelectedInstalment(nextUnpaidItem);
                setPaymentModalOpen(true);
              }}
              className="px-4 py-2 bg-[#218568] hover:bg-[#1b6b54] text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pay Next EMI ({formatINR(loan.monthlyEmi)})</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D343B] text-white rounded-2xl p-5 shadow-xs border border-[#0D343B]">
          <span className="text-[11px] font-semibold text-[#D9E0E5] uppercase tracking-wider">
            Sanctioned Principal
          </span>
          <p className="text-2xl font-bold text-white mt-1 tabular-nums">
            {formatINR(loan.principalAmount)}
          </p>
          <p className="text-xs text-[#D9E0E5] mt-1">
            Interest: {loan.annualInterestRate}% p.a.
          </p>
        </div>

        <div className="bg-[#6B751B] text-white rounded-2xl p-5 shadow-xs border border-[#6B751B]">
          <span className="text-[11px] font-semibold text-[#D9E0E5] uppercase tracking-wider">
            Monthly EMI
          </span>
          <p className="text-2xl font-bold text-white mt-1 tabular-nums">
            {formatINR(loan.monthlyEmi)}
          </p>
          <p className="text-xs text-[#D9E0E5] mt-1">
            Tenure: {loan.tenureMonths} Months
          </p>
        </div>

        <div className="bg-[#E65327] text-white rounded-2xl p-5 shadow-xs border border-[#E65327]">
          <span className="text-[11px] font-semibold text-[#D9E0E5] uppercase tracking-wider">
            Total Paid to Date
          </span>
          <p className="text-2xl font-bold text-white mt-1 tabular-nums">
            {formatINR(loan.paidAmount)}
          </p>
          <p className="text-xs text-white mt-1 font-medium">
            {progressPercent}% Repaid
          </p>
        </div>

        <div className="bg-[#E8EA68] text-[#0D2740] rounded-2xl p-5 shadow-xs border border-[#DFE5E9]">
          <span className="text-[11px] font-semibold text-[#0D2740]/80 uppercase tracking-wider">
            Remaining Balance
          </span>
          <p className="text-2xl font-bold text-[#0D2740] mt-1 tabular-nums">
            {formatINR(loan.remainingAmount)}
          </p>
          <p className="text-xs text-[#0D2740]/80 mt-1">
            Total Sanction: {formatINR(loan.totalRepayment)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-[#172B3A]">Repayment Completion</span>
          <span className="font-bold text-[#612536] tabular-nums">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-[#EDF2F5] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#218568] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-[#536473] pt-1">
          <span>Paid: {formatINR(loan.paidAmount)}</span>
          <span>Remaining: {formatINR(loan.remainingAmount)}</span>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#172B3A]">Amortization Schedule</h3>
            <p className="text-xs text-[#536473]">
              Month-by-month breakdown of principal, interest, and remaining balance.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#F5F8FA] p-1 rounded-xl border border-[#DFE5E9]">
            {(['all', 'pending', 'paid'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setScheduleFilter(filter)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  scheduleFilter === filter
                    ? 'bg-[#612536] text-white shadow-xs'
                    : 'text-[#536473] hover:text-[#172B3A]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFE5E9] text-[#536473] uppercase tracking-wider text-[11px] bg-[#F5F8FA]">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Principal</th>
                <th className="py-3 px-4">Interest</th>
                <th className="py-3 px-4">Total EMI</th>
                <th className="py-3 px-4">Remaining Principal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE5E9]">
              {filteredSchedule.map((item) => (
                <tr key={item.id} className="hover:bg-[#F5F8FA] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#172B3A]">
                    {item.instalmentNumber}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#172B3A]">
                    {formatDate(item.dueDate)}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-[#172B3A]">
                    {formatINR(item.principalComponent)}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-[#C28A20] font-medium">
                    {formatINR(item.interestComponent)}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums font-bold text-[#612536]">
                    {formatINR(item.monthlyEmi)}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-[#536473]">
                    {formatINR(item.remainingPrincipal)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.status === 'paid' ? (
                      <span className="text-[11px] text-[#218568] font-semibold">
                        Paid on {formatDate(item.paidDate)}
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedInstalment(item);
                          setPaymentModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-[#218568] hover:bg-[#1b6b54] text-white rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {selectedInstalment && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedInstalment(null);
          }}
          loanId={loan.id}
          instalmentNumber={selectedInstalment.instalmentNumber}
          amount={selectedInstalment.monthlyEmi}
          customerName={user?.fullName || 'Priya Sharma'}
          customerId={user?.id || 'USR-001'}
          onPaymentSuccess={fetchLoanData}
        />
      )}
    </div>
  );
};
