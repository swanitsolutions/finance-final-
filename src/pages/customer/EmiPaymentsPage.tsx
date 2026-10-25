import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api/apiClient';
import { Loan, EMIScheduleItem } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters/currency';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PaymentModal } from '../../components/modals/PaymentModal';
import { CreditCard, Calendar, ShieldCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export const EmiPaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [pendingItems, setPendingItems] = useState<{ loan: Loan; scheduleItem: EMIScheduleItem }[]>([]);
  const [loading, setLoading] = useState(true);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activePaymentTarget, setActivePaymentTarget] = useState<{ loan: Loan; item: EMIScheduleItem } | null>(null);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const loansRes = await apiClient.getLoans();
    if (loansRes.success && loansRes.data) {
      const myLoans = loansRes.data.filter((l) => l.customerId === user.id && l.status === 'active');
      setLoans(myLoans);

      const items: { loan: Loan; scheduleItem: EMIScheduleItem }[] = [];
      for (const loan of myLoans) {
        const schedRes = await apiClient.getLoanSchedule(loan.id);
        if (schedRes.success && schedRes.data) {
          const nextUnpaid = schedRes.data.find((s) => s.status !== 'paid');
          if (nextUnpaid) {
            items.push({ loan, scheduleItem: nextUnpaid });
          }
        }
      }
      setPendingItems(items);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#172B3A]">EMI Payments</h2>
        <p className="text-xs text-[#536473] mt-0.5">
          Review upcoming instalments and settle payments via authorized banking channels.
        </p>
      </div>

      {/* Payment Security Advisory */}
      <div className="p-4 bg-[#EDF2F5] rounded-2xl border border-[#DFE5E9] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#153755] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#172B3A]">Automated Repayment Clearing</h4>
            <p className="text-[11px] text-[#536473]">
              Payments made here reconcile instantly against the loan amortization ledger.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-semibold text-[#218568] bg-[#E6F4EE] px-2.5 py-1 rounded-full">
          Auto-Reconciled
        </span>
      </div>

      {/* Due Instalments Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#172B3A]">Upcoming & Due Instalments</h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#536473]">Loading due instalments...</div>
        ) : pendingItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#DFE5E9] p-10 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#218568] mx-auto" />
            <h4 className="text-base font-bold text-[#172B3A]">All Caught Up!</h4>
            <p className="text-xs text-[#536473] max-w-sm mx-auto">
              You have no pending or overdue instalments due at this time. Thank you for maintaining an immaculate repayment record!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingItems.map(({ loan, scheduleItem }) => (
              <div
                key={scheduleItem.id}
                className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#153755] uppercase">
                        {loan.loanType} Loan
                      </span>
                      <h4 className="text-base font-bold text-[#172B3A] font-mono mt-0.5">
                        {loan.id}
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#FFF4D9] text-[#C28A20]">
                      Due Next
                    </span>
                  </div>

                  <div className="my-4 p-4 bg-[#F5F8FA] rounded-xl border border-[#DFE5E9] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#536473] font-medium">Instalment #{scheduleItem.instalmentNumber}</span>
                      <p className="text-2xl font-bold text-[#153755] tabular-nums mt-0.5">
                        {formatINR(scheduleItem.monthlyEmi)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#536473] font-medium flex items-center justify-end gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C28A20]" /> Due Date
                      </span>
                      <p className="text-xs font-bold text-[#172B3A] mt-0.5">
                        {formatDate(scheduleItem.dueDate)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#536473]">
                    <div className="flex justify-between">
                      <span>Principal Portion:</span>
                      <span className="font-semibold text-[#172B3A] tabular-nums">
                        {formatINR(scheduleItem.principalComponent)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Portion:</span>
                      <span className="font-semibold text-[#C28A20] tabular-nums">
                        {formatINR(scheduleItem.interestComponent)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#DFE5E9]">
                  <button
                    onClick={() => {
                      setActivePaymentTarget({ loan, item: scheduleItem });
                      setPaymentModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-[#218568] hover:bg-[#1b6b54] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay {formatINR(scheduleItem.monthlyEmi)} Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {activePaymentTarget && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false);
            setActivePaymentTarget(null);
          }}
          loanId={activePaymentTarget.loan.id}
          instalmentNumber={activePaymentTarget.item.instalmentNumber}
          amount={activePaymentTarget.item.monthlyEmi}
          customerName={user?.fullName || 'Priya Sharma'}
          customerId={user?.id || 'USR-001'}
          onPaymentSuccess={loadData}
        />
      )}
    </div>
  );
};
