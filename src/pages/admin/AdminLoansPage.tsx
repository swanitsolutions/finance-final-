import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/api/apiClient';
import { Loan } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters/currency';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useNotification } from '../../context/NotificationContext';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Eye,
  AlertCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const AdminLoansPage: React.FC = () => {
  const { success, error } = useNotification();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Rejection modal
  const [rejectingLoan, setRejectingLoan] = useState<Loan | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchLoans = async () => {
    setLoading(true);
    const res = await apiClient.getLoans();
    setLoading(false);
    if (res.success && res.data) {
      setLoans(res.data);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApprove = async (loan: Loan) => {
    const res = await apiClient.approveLoan(loan.id, 'Admin Administrator');
    if (res.success) {
      success('Loan Approved', res.message);
      fetchLoans();
    } else {
      error('Approval Error', res.message || 'Could not approve loan.');
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingLoan) return;
    if (!rejectionReason.trim()) {
      error('Reason Required', 'Please enter a rejection reason.');
      return;
    }

    const res = await apiClient.rejectLoan(rejectingLoan.id, rejectionReason);
    if (res.success) {
      success('Loan Rejected', res.message);
      setRejectingLoan(null);
      setRejectionReason('');
      fetchLoans();
    } else {
      error('Rejection Error', res.message || 'Could not reject loan.');
    }
  };

  const filtered = loans.filter((l) => {
    const matchesStatus = filterStatus === 'all' || l.status.toLowerCase() === filterStatus.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      l.id.toLowerCase().includes(q) ||
      l.customerName.toLowerCase().includes(q) ||
      l.loanType.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172B4D]">Loan Accounts & Applications</h2>
          <p className="text-xs text-[#687B94] mt-0.5">
            Approve credit requests, audit active loan books, and manage repayments.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DFE7F0] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['all', 'pending', 'active', 'completed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-[#12365A] text-white shadow-2xs'
                  : 'text-[#687B94] hover:bg-gray-100 hover:text-[#172B4D]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30"
          />
        </div>
      </div>

      {/* Loans Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFE7F0] text-[#687B94] uppercase tracking-wider text-[11px] bg-[#F4F8FC]">
                <th className="py-3 px-4">Loan ID</th>
                <th className="py-3 px-4">Borrower</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Principal</th>
                <th className="py-3 px-4">Rate & Tenure</th>
                <th className="py-3 px-4">Monthly EMI</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#172B4D]">
                    <Link to={`/admin/loans/${loan.id}`} className="hover:text-[#5145CD] hover:underline">
                      {loan.id}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#172B4D]">{loan.customerName}</p>
                    <p className="text-[11px] text-[#687B94]">{loan.customerEmail}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#5145CD]">
                    {loan.loanType}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums font-bold text-[#172B4D]">
                    {formatINR(loan.principalAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-[#687B94]">
                    {loan.annualInterestRate}% • {loan.tenureMonths}m
                  </td>
                  <td className="py-3.5 px-4 tabular-nums font-bold text-[#12365A]">
                    {formatINR(loan.monthlyEmi)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={loan.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {loan.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(loan)}
                          className="px-2.5 py-1 bg-[#159A78] hover:bg-[#0f7a5e] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => setRejectingLoan(loan)}
                          className="px-2.5 py-1 bg-[#FFF0F1] hover:bg-red-100 text-[#DC5263] border border-[#DC5263]/30 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <Link
                        to={`/admin/loans/${loan.id}`}
                        className="px-2.5 py-1 text-xs font-semibold text-[#5145CD] hover:bg-[#5145CD]/10 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Audit File
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Confirmation Modal with Mandatory Reason */}
      {rejectingLoan && (
        <Modal
          isOpen={!!rejectingLoan}
          onClose={() => setRejectingLoan(null)}
          title={`Reject Loan Application: ${rejectingLoan.id}`}
          subtitle={`Applicant: ${rejectingLoan.customerName} • Requested Amount: ${formatINR(rejectingLoan.principalAmount)}`}
          maxWidth="md"
        >
          <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
            <div className="p-3 bg-[#FFF0F1] rounded-xl border border-[#DC5263]/30 text-[#9b2130]">
              Please state the credit risk or underwriting policy reason for this rejection.
            </div>

            <div>
              <label className="block font-semibold text-[#172B4D] mb-1">
                Rejection Reason (Audit Required) *
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Debt-to-income ratio exceeds threshold, insufficient verified income documentation..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#DC5263]/30"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => setRejectingLoan(null)}
                className="px-4 py-2 border border-[#DFE7F0] rounded-xl font-semibold text-[#172B4D] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#DC5263] hover:bg-[#b83e4d] text-white rounded-xl font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
