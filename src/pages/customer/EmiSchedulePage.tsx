import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api/apiClient';
import { Loan, EMIScheduleItem } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters/currency';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PaymentModal } from '../../components/modals/PaymentModal';
import { Calendar, CreditCard, Printer, Filter, CheckCircle2 } from 'lucide-react';

export const EmiSchedulePage: React.FC = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedLoanId, setSelectedLoanId] = useState<string>('');
  const [schedule, setSchedule] = useState<EMIScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInstalment, setSelectedInstalment] = useState<EMIScheduleItem | null>(null);

  const fetchLoansAndSchedule = async () => {
    if (!user) return;
    setLoading(true);
    const loansRes = await apiClient.getLoans();
    if (loansRes.success && loansRes.data) {
      const myLoans = loansRes.data.filter((l) => l.customerId === user.id);
      setLoans(myLoans);
      if (myLoans.length > 0) {
        const activeLoanId = selectedLoanId || myLoans[0].id;
        setSelectedLoanId(activeLoanId);
        const schedRes = await apiClient.getLoanSchedule(activeLoanId);
        if (schedRes.success && schedRes.data) {
          setSchedule(schedRes.data);
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLoansAndSchedule();
  }, [user]);

  const handleLoanChange = async (loanId: string) => {
    setSelectedLoanId(loanId);
    setLoading(true);
    const schedRes = await apiClient.getLoanSchedule(loanId);
    setLoading(false);
    if (schedRes.success && schedRes.data) {
      setSchedule(schedRes.data);
    }
  };

  const selectedLoan = loans.find((l) => l.id === selectedLoanId);

  const filteredItems = schedule.filter((item) => {
    if (filterStatus === 'paid') return item.status === 'paid';
    if (filterStatus === 'pending') return item.status !== 'paid';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172B4D]">EMI Schedule</h2>
          <p className="text-xs text-[#687B94] mt-0.5">
            Complete reducing-balance amortization timeline for your active loans.
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

      {/* Loan Selector Bar */}
      <div className="bg-white rounded-2xl border border-[#DFE7F0] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-bold text-[#172B4D] shrink-0">Select Loan:</label>
          <select
            value={selectedLoanId}
            onChange={(e) => handleLoanChange(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30"
          >
            {loans.map((l) => (
              <option key={l.id} value={l.id}>
                {l.id} — {l.loanType} ({formatINR(l.principalAmount)})
              </option>
            ))}
          </select>
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 bg-[#F4F8FC] p-1 rounded-xl border border-[#DFE7F0]">
          {['all', 'pending', 'paid'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-white text-[#12365A] shadow-xs'
                  : 'text-[#687B94] hover:text-[#172B4D]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Loan Overview Strip */}
      {selectedLoan && (
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-5 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#687B94]">Principal</span>
            <p className="font-bold text-[#172B4D] text-base mt-0.5 tabular-nums">
              {formatINR(selectedLoan.principalAmount)}
            </p>
          </div>
          <div>
            <span className="text-[#687B94]">Monthly EMI</span>
            <p className="font-bold text-[#5145CD] text-base mt-0.5 tabular-nums">
              {formatINR(selectedLoan.monthlyEmi)}
            </p>
          </div>
          <div>
            <span className="text-[#687B94]">Interest Rate</span>
            <p className="font-bold text-[#172B4D] text-base mt-0.5">
              {selectedLoan.annualInterestRate}% p.a.
            </p>
          </div>
          <div>
            <span className="text-[#687B94]">Tenure</span>
            <p className="font-bold text-[#172B4D] text-base mt-0.5">
              {selectedLoan.tenureMonths} Months
            </p>
          </div>
        </div>
      )}

      {/* Schedule Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFE7F0] text-[#687B94] uppercase tracking-wider text-[11px] bg-[#F4F8FC]">
                <th className="py-3 px-4">Instalment #</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Principal Component</th>
                <th className="py-3 px-4">Interest Component</th>
                <th className="py-3 px-4">Total Monthly EMI</th>
                <th className="py-3 px-4">Closing Principal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#172B4D]">
                    #{item.instalmentNumber.toString().padStart(2, '0')}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#172B4D]">
                    {formatDate(item.dueDate)}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-[#172B4D]">
                    {formatINR(item.principalComponent)}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-[#E7A23B] font-medium">
                    {formatINR(item.interestComponent)}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums font-bold text-[#5145CD]">
                    {formatINR(item.monthlyEmi)}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-[#687B94]">
                    {formatINR(item.remainingPrincipal)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {item.status === 'paid' ? (
                      <span className="text-[11px] text-[#159A78] font-semibold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Paid
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedInstalment(item);
                          setPaymentModalOpen(true);
                        }}
                        className="px-3 py-1 bg-[#159A78] hover:bg-[#0f7a5e] text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Pay EMI
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
      {selectedInstalment && selectedLoan && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setSelectedInstalment(null);
          }}
          loanId={selectedLoan.id}
          instalmentNumber={selectedInstalment.instalmentNumber}
          amount={selectedInstalment.monthlyEmi}
          customerName={user?.fullName || 'Priya Sharma'}
          customerId={user?.id || 'USR-001'}
          onPaymentSuccess={fetchLoansAndSchedule}
        />
      )}
    </div>
  );
};
