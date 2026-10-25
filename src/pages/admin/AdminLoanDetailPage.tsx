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
            className="p-2 bg-white rounded-xl border border-[#DFE5E9] hover:bg-[#F3F5F6] text-[#172B3A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#172B3A]">Audit File: {loan.id}</h2>
              <StatusBadge status={loan.status} size="sm" />
            </div>
            <p className="text-xs text-[#536473] mt-0.5">
              Customer: {loan.customerName} ({loan.customerEmail})
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-white border border-[#DFE5E9] hover:bg-[#F3F5F6] rounded-xl text-xs font-semibold text-[#172B3A] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5 text-[#7B8994]" />
          <span>Print Sanction Dossier</span>
        </button>
      </div>

      {/* Grid: Borrower profile summary & Loan metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-sm text-[#172B3A] pb-2 border-b border-[#DFE5E9] flex items-center gap-2">
            <User className="w-4 h-4 text-[#612536]" /> Borrower Profile
          </h3>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#536473]">Full Legal Name:</span>
              <span className="font-semibold text-[#172B3A]">{loan.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#536473]">Email Address:</span>
              <span className="text-[#172B3A]">{loan.customerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#536473]">Mobile Number:</span>
              <span className="text-[#172B3A]">{loan.customerPhone || 'Verified on file'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#536473]">Employment Type:</span>
              <span className="font-semibold text-[#172B3A]">{loan.employmentType || 'Salaried'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-sm text-[#172B3A] pb-2 border-b border-[#DFE5E9] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#153755]" /> Sanction Terms
          </h3>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#536473]">Principal Disbursed:</span>
              <span className="font-bold text-[#172B3A] tabular-nums">{formatINR(loan.principalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#536473]">Annual Percentage Rate:</span>
              <span className="font-semibold text-[#172B3A]">{loan.annualInterestRate}% p.a.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#536473]">Tenure Duration:</span>
              <span className="font-semibold text-[#172B3A]">{loan.tenureMonths} Months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#536473]">Monthly EMI:</span>
              <span className="font-bold text-[#612536] tabular-nums">{formatINR(loan.monthlyEmi)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-3 text-xs">
          <h3 className="font-bold text-sm text-[#172B3A] pb-2 border-b border-[#DFE5E9] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#218568]" /> Ledger Standing
          </h3>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#536473]">Total Paid:</span>
              <span className="font-bold text-[#218568] tabular-nums">{formatINR(loan.paidAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#536473]">Outstanding Balance:</span>
              <span className="font-bold text-[#C9414D] tabular-nums">{formatINR(loan.remainingAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#536473]">Total Lifetime Amount:</span>
              <span className="font-semibold text-[#172B3A] tabular-nums">{formatINR(loan.totalRepayment)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amortization Schedule Table */}
      <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#172B3A]">Generated Amortization Ledger</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFE5E9] text-[#536473] uppercase tracking-wider text-[11px] bg-[#F5F8FA]">
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
            <tbody className="divide-y divide-[#DFE5E9]">
              {schedule.map((item) => (
                <tr key={item.id} className="hover:bg-[#F5F8FA]">
                  <td className="py-3 px-4 font-mono font-bold text-[#172B3A]">
                    {item.instalmentNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#172B3A]">
                    {formatDate(item.dueDate)}
                  </td>
                  <td className="py-3 px-4 tabular-nums text-[#172B3A]">
                    {formatINR(item.principalComponent)}
                  </td>
                  <td className="py-3 px-4 tabular-nums text-[#C28A20] font-medium">
                    {formatINR(item.interestComponent)}
                  </td>
                  <td className="py-3 px-4 tabular-nums font-bold text-[#612536]">
                    {formatINR(item.monthlyEmi)}
                  </td>
                  <td className="py-3 px-4 tabular-nums text-[#536473]">
                    {formatINR(item.remainingPrincipal)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#7B8994] text-right">
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
