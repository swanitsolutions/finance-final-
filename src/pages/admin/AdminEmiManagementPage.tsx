import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api/apiClient';
import { Loan, EMIScheduleItem } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters/currency';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Search, Calendar, CheckCircle2, Clock, Filter, Printer } from 'lucide-react';

interface CombinedEmiRow {
  loanId: string;
  customerName: string;
  instalmentNumber: number;
  dueDate: string;
  amount: number;
  principal: number;
  interest: number;
  status: EMIScheduleItem['status'];
  paidDate?: string;
}

export const AdminEmiManagementPage: React.FC = () => {
  const [rows, setRows] = useState<CombinedEmiRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllSchedules = async () => {
      setLoading(true);
      const loansRes = await apiClient.getLoans();
      const allRows: CombinedEmiRow[] = [];

      if (loansRes.success && loansRes.data) {
        for (const loan of loansRes.data) {
          const schedRes = await apiClient.getLoanSchedule(loan.id);
          if (schedRes.success && schedRes.data) {
            for (const item of schedRes.data) {
              allRows.push({
                loanId: loan.id,
                customerName: loan.customerName,
                instalmentNumber: item.instalmentNumber,
                dueDate: item.dueDate,
                amount: item.monthlyEmi,
                principal: item.principalComponent,
                interest: item.interestComponent,
                status: item.status,
                paidDate: item.paidDate,
              });
            }
          }
        }
      }
      setRows(allRows);
      setLoading(false);
    };

    fetchAllSchedules();
  }, []);

  const filtered = rows.filter((r) => {
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      r.customerName.toLowerCase().includes(q) ||
      r.loanId.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172B4D]">EMI Management</h2>
          <p className="text-xs text-[#687B94] mt-0.5">
            Monitor and reconcile monthly Equated Monthly Instalments across all borrower portfolios.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="self-start sm:self-auto px-4 py-2 bg-white border border-[#DFE7F0] hover:bg-gray-50 rounded-xl text-xs font-semibold text-[#172B4D] flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-[#687B94]" />
          <span>Export Master Schedule</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-[#DFE7F0] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-1.5 bg-[#F4F8FC] p-1 rounded-xl border border-[#DFE7F0]">
          {['all', 'pending', 'paid', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-white text-[#12365A] shadow-xs'
                  : 'text-[#687B94] hover:text-[#172B4D]'
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
            placeholder="Search customer or loan ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30"
          />
        </div>
      </div>

      {/* Master Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFE7F0] text-[#687B94] uppercase tracking-wider text-[11px] bg-[#F4F8FC]">
                <th className="py-3 px-4">Loan ID</th>
                <th className="py-3 px-4">Borrower</th>
                <th className="py-3 px-4">Instalment #</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Principal</th>
                <th className="py-3 px-4">Interest</th>
                <th className="py-3 px-4">Total EMI</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Settlement Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.slice(0, 50).map((r, idx) => (
                <tr key={idx} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#5145CD]">{r.loanId}</td>
                  <td className="py-3 px-4 font-semibold text-[#172B4D]">{r.customerName}</td>
                  <td className="py-3 px-4 font-mono text-[#687B94]">#{r.instalmentNumber}</td>
                  <td className="py-3 px-4 text-[#172B4D]">{formatDate(r.dueDate)}</td>
                  <td className="py-3 px-4 tabular-nums text-[#172B4D]">{formatINR(r.principal)}</td>
                  <td className="py-3 px-4 tabular-nums text-[#E7A23B] font-medium">{formatINR(r.interest)}</td>
                  <td className="py-3 px-4 tabular-nums font-bold text-[#12365A]">{formatINR(r.amount)}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={r.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right text-[#687B94]">
                    {r.paidDate ? formatDate(r.paidDate) : '—'}
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
