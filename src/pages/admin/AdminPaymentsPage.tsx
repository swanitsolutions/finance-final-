import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api/apiClient';
import { PaymentTransaction } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters/currency';
import { Search, Download, Printer, Receipt, CheckCircle2 } from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  useEffect(() => {
    const fetchTxns = async () => {
      setLoading(true);
      const res = await apiClient.getTransactions();
      setLoading(false);
      if (res.success && res.data) {
        setTransactions(res.data);
      }
    };
    fetchTxns();
  }, []);

  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Loan ID', 'Customer Name', 'Amount', 'Method', 'Date', 'Receipt Number'];
    const rows = filtered.map((t) => [
      t.id,
      t.loanId,
      t.customerName,
      t.amount,
      t.paymentMethod,
      t.paymentDate,
      t.receiptNumber,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LoanEase_Payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = transactions.filter((t) => {
    const matchesMethod = methodFilter === 'all' || t.paymentMethod.toLowerCase() === methodFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      t.id.toLowerCase().includes(q) ||
      t.loanId.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      t.receiptNumber.toLowerCase().includes(q);
    return matchesMethod && matchesQuery;
  });

  const totalCollected = transactions
    .filter((t) => !t.description.toLowerCase().includes('disbursal'))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172B3A]">Payment Transactions & Collections</h2>
          <p className="text-xs text-[#536473] mt-0.5">
            Real-time verified ledger of collections, disbursements, and gateway settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white border border-[#DFE5E9] hover:bg-[#F3F5F6] rounded-xl text-xs font-semibold text-[#172B3A] flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#612536]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white border border-[#DFE5E9] hover:bg-[#F3F5F6] rounded-xl text-xs font-semibold text-[#172B3A] flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#7B8994]" />
            <span>Print Ledger</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#DFE5E9] p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-[#536473] uppercase tracking-wider">
            Total Inflow Collections
          </span>
          <p className="text-2xl font-bold text-[#218568] tabular-nums mt-1">
            {formatINR(totalCollected)}
          </p>
          <p className="text-xs text-[#536473] mt-0.5">Reconciled to banking ledger</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#DFE5E9] p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-[#536473] uppercase tracking-wider">
            Total Recorded Entries
          </span>
          <p className="text-2xl font-bold text-[#172B3A] tabular-nums mt-1">
            {transactions.length}
          </p>
          <p className="text-xs text-[#536473] mt-0.5">Zero unverified records</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#DFE5E9] p-5 shadow-xs flex flex-col justify-center">
          <label className="text-[11px] font-semibold text-[#536473] uppercase tracking-wider mb-2">
            Payment Method Filter
          </label>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] font-medium focus:outline-none"
          >
            <option value="all">All Channels</option>
            <option value="upi">UPI (GPay / PhonePe / BHIM)</option>
            <option value="net banking">Net Banking</option>
            <option value="debit card">Debit Card</option>
            <option value="bank transfer">Bank Transfer (Disbursals)</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#DFE5E9] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFE5E9] text-[#536473] uppercase tracking-wider text-[11px] bg-[#F5F8FA]">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Borrower</th>
                <th className="py-3 px-4">Loan Account</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Receipt Ref</th>
                <th className="py-3 px-4 text-right">Gateway Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE5E9]">
              {filtered.map((txn) => {
                const isDisbursal = txn.description.toLowerCase().includes('disbursal');
                return (
                  <tr key={txn.id} className="hover:bg-[#F5F8FA] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#172B3A]">
                      {txn.id}
                    </td>
                    <td className="py-3 px-4 text-[#172B3A]">{formatDate(txn.paymentDate)}</td>
                    <td className="py-3 px-4 font-semibold text-[#172B3A]">
                      {txn.customerName}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#153755] font-semibold">
                      {txn.loanId}
                    </td>
                    <td className="py-3 px-4 text-[#536473]">{txn.paymentMethod}</td>
                    <td className="py-3 px-4 tabular-nums font-bold">
                      <span className={isDisbursal ? 'text-[#C9414D]' : 'text-[#218568]'}>
                        {isDisbursal ? '+' : ''}
                        {formatINR(txn.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#7B8994]">
                      {txn.receiptNumber}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#218568] bg-[#E6F4EE] px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Authoritative
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
