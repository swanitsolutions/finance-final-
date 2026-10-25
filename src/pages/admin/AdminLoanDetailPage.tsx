import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../lib/api/apiClient';
import { Loan, EMIScheduleItem } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters/currency';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useNotification } from '../../context/NotificationContext';
import { ArrowLeft, CheckCircle2, FileText, Printer, ShieldCheck, User } from 'lucide-react';

export const AdminLoanDetailPage: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const { success, error } = useNotification();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [schedule, setSchedule] = useState<EMIScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading || !loan) {
    return <div className="py-20 text-center text-xs text-[#687B94]">Loading loan audit file...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/loans"
            className="p-2 bg-white rounded-xl border border-[#DFE7F0] hover:bg-gray-50 text-[#172B4D] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#172B4D]">Audit File: {loan.id}</h2>
              <StatusBadge status={loan.status} size="sm" />
            </div>
            <p className="text-xs text-[#687B94] mt-0.5">
              Customer: {loan.customerName} ({loan.customerEmail})
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-[#DFE7F0] hover:bg-gray-50 rounded-xl text-xs font-semibold text-[#172B4D] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5 text-[#687B94]" />
          <span>Print Sanction Dossier</span>
        </button>
      </div>

      {/* Grid: Borrower profile summary & Loan metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-sm text-[#172B4D] pb-2 border-b border-gray-100 flex items-center gap-2">
            <User className="w-4 h-4 text-[#5145CD]" /> Borrower Profile
          </h3>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#687B94]">Full Legal Name:</span>
              <span className="font-semibold text-[#172B4D]">{loan.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687B94]">Email Address:</span>
              <span className="text-[#172B4D]">{loan.customerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687B94]">Mobile Number:</span>
              <span className="text-[#172B4D]">{loan.customerPhone || 'Verified on file'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687B94]">Employment Type:</span>
              <span className="font-semibold text-[#172B4D]">{loan.employmentType || 'Salaried'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-sm text-[#172B4D] pb-2 border-b border-gray-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#5145CD]" /> Sanction Terms
          </h3>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#687B94]">Principal Disbursed:</span>
              <span className="font-bold text-[#172B4D] tabular-nums">{formatINR(loan.principalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687B94]">Annual Percentage Rate:</span>
              <span className="font-semibold text-[#172B4D]">{loan.annualInterestRate}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687B94]">Tenure Duration:</span>
              <span className="font-semibold text-[#172B4D]">{loan.tenureMonths} Months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687B94]">Monthly EMI:</span>
              <span className="font-bold text-[#5145CD] tabular-nums">{formatINR(loan.monthlyEmi)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-sm text-[#172B4D] pb-2 border-b border-gray-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#159A78]" /> Ledger Standing
          </h3>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#687B94]">Total Paid:</span>
              <span className="font-bold text-[#159A78] tabular-nums">{formatINR(loan.paidAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687B94]">Outstanding Balance:</span>
              <span className="font-bold text-[#DC5263] tabular-nums">{formatINR(loan.remainingAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#687B94]">Total Lifetime Amount:</span>
              <span className="font-semibold text-[#172B4D] tabular-nums">{formatINR(loan.totalRepayment)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#172B4D]">Generated Amortization Ledger</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFE7F0] text-[#687B94] uppercase tracking-wider text-[11px] bg-[#F4F8FC]">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Principal Component</th>
                <th className="py-3 px-4">Interest Component</th>
                <th className="py-3 px-4">Monthly EMI</th>
                <th className="py-3 px-4">Closing Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Audit Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {schedule.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-[#172B4D]">
                    {item.instalmentNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#172B4D]">
                    {formatDate(item.dueDate)}
                  </td>
                  <td className="py-3 px-4 tabular-nums text-[#172B4D]">
                    {formatINR(item.principalComponent)}
                  </td>
                  <td className="py-3 px-4 tabular-nums text-[#E7A23B] font-medium">
                    {formatINR(item.interestComponent)}
                  </td>
                  <td className="py-3 px-4 tabular-nums font-bold text-[#5145CD]">
                    {formatINR(item.monthlyEmi)}
                  </td>
                  <td className="py-3 px-4 tabular-nums text-[#687B94]">
                    {formatINR(item.remainingPrincipal)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-gray-400 text-right">
                    {item.transactionRef || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
