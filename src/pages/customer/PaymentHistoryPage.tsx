import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api/apiClient';
import { PaymentTransaction } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters/currency';
import { Modal } from '../../components/common/Modal';
import { Receipt, Search, Download, Printer, CheckCircle2, TrendingUp } from 'lucide-react';

export const PaymentHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);
    const res = await apiClient.getTransactions(user.id);
    setLoading(false);
    if (res.success && res.data) {
      setTransactions(res.data);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const filteredTxns = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.loanId.toLowerCase().includes(q) ||
      t.receiptNumber.toLowerCase().includes(q) ||
      t.paymentMethod.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  const totalPaymentsAmount = transactions
    .filter((t) => !t.description.toLowerCase().includes('disbursal'))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172B4D]">Payment History</h2>
          <p className="text-xs text-[#687B94] mt-0.5">
            Verified audit trail of all loan disbursements and EMI instalment settlements.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="self-start sm:self-auto px-4 py-2 bg-white border border-[#DFE7F0] hover:bg-gray-50 rounded-xl text-xs font-semibold text-[#172B4D] flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-[#687B94]" />
          <span>Print Statement</span>
        </button>
      </div>

      {/* KPI banner & search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-[#687B94] uppercase tracking-wider">
            Total EMI Paid
          </span>
          <p className="text-2xl font-bold text-[#159A78] tabular-nums mt-1">
            {formatINR(totalPaymentsAmount)}
          </p>
          <p className="text-xs text-[#687B94] mt-0.5">All transactions reconciled</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-[#687B94] uppercase tracking-wider">
            Total Transactions
          </span>
          <p className="text-2xl font-bold text-[#172B4D] tabular-nums mt-1">
            {transactions.length}
          </p>
          <p className="text-xs text-[#687B94] mt-0.5">Disbursements & Repayments</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-5 shadow-xs flex flex-col justify-center">
          <label className="text-[11px] font-semibold text-[#687B94] uppercase tracking-wider mb-2">
            Search Ledger
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by ID, loan or receipt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFE7F0] text-[#687B94] uppercase tracking-wider text-[11px] bg-[#F4F8FC]">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Loan Account</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#687B94]">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((txn) => {
                  const isDisbursal = txn.description.toLowerCase().includes('disbursal');
                  return (
                    <tr key={txn.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#172B4D]">
                        {txn.id}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#172B4D]">
                        {formatDate(txn.paymentDate)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#5145CD] font-medium">
                        {txn.loanId}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#172B4D]">
                        {txn.description}
                      </td>
                      <td className="py-3.5 px-4 text-[#687B94]">
                        {txn.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 tabular-nums font-bold">
                        <span
                          className={isDisbursal ? 'text-[#DC5263]' : 'text-[#159A78]'}
                        >
                          {isDisbursal ? '+' : ''}
                          {formatINR(txn.amount)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E7F7F0] text-[#159A78]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#159A78]" />
                          Completed
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedReceipt(txn)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#5145CD] hover:bg-[#5145CD]/10 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5" /> Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="Payment Acknowledgement & Receipt"
          subtitle="Official Record of Settlement"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-[#F4F8FC] rounded-xl border border-[#DFE7F0] text-center">
              <span className="text-[11px] text-[#687B94] uppercase tracking-wider block">
                Total Transaction Amount
              </span>
              <span className="text-3xl font-extrabold text-[#159A78] tabular-nums mt-1 block">
                {formatINR(selectedReceipt.amount)}
              </span>
              <span className="text-[11px] text-[#159A78] font-semibold mt-0.5 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Successfully Cleared
              </span>
            </div>

            <div className="space-y-2 border-y border-gray-100 py-3">
              <div className="flex justify-between">
                <span className="text-[#687B94]">Transaction Reference:</span>
                <span className="font-mono font-bold text-[#172B4D]">{selectedReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#687B94]">Receipt Voucher:</span>
                <span className="font-mono text-[#172B4D]">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#687B94]">Loan Account ID:</span>
                <span className="font-mono font-semibold text-[#5145CD]">{selectedReceipt.loanId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#687B94]">Payment Method:</span>
                <span className="font-semibold text-[#172B4D]">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#687B94]">Payment Date:</span>
                <span className="text-[#172B4D]">{formatDate(selectedReceipt.paymentDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#687B94]">Customer Name:</span>
                <span className="text-[#172B4D]">{selectedReceipt.customerName}</span>
              </div>
            </div>

            <p className="text-[10px] text-center text-[#687B94]">
              This voucher serves as valid digital proof of instalment settlement under Indian banking regulations.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl border border-[#DFE7F0] text-xs font-semibold hover:bg-gray-50 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="flex-1 py-2 rounded-xl bg-[#5145CD] text-white text-xs font-semibold hover:bg-[#4036B5]"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
