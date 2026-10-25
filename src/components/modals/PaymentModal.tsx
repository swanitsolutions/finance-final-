import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { formatINR } from '../../lib/formatters/currency';
import { apiClient } from '../../lib/api/apiClient';
import { useNotification } from '../../context/NotificationContext';
import { PaymentMethod } from '../../types';
import { CreditCard, Smartphone, Building2, CheckCircle2, Download, Printer } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanId: string;
  instalmentNumber?: number;
  amount: number;
  customerName: string;
  customerId: string;
  onPaymentSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  loanId,
  instalmentNumber = 1,
  amount,
  customerName,
  customerId,
  onPaymentSuccess,
}) => {
  const { success, error } = useNotification();
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('priya@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<{
    id: string;
    receiptNumber: string;
    date: string;
    amount: number;
  } | null>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await apiClient.recordPayment({
        loanId,
        customerId,
        customerName,
        instalmentNumber,
        amount,
        paymentMethod: method,
        description: `Instalment #${instalmentNumber} payment for ${loanId}`,
      });

      if (res.success && res.data) {
        setCompletedTxn({
          id: res.data.transaction.id,
          receiptNumber: res.data.transaction.receiptNumber,
          date: res.data.transaction.paymentDate,
          amount: res.data.transaction.amount,
        });
        success('Payment Verified', res.message);
        onPaymentSuccess?.();
      } else {
        error('Payment Failed', res.message || 'Payment processing error');
      }
    } catch (err) {
      error('Error', 'An unexpected error occurred while processing transaction.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setCompletedTxn(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={completedTxn ? 'Payment Receipt' : 'Pay Monthly EMI Instalment'}
      subtitle={completedTxn ? 'Verified Bank Transaction Confirmation' : `Loan Account: ${loanId} • Instalment #${instalmentNumber}`}
      maxWidth="md"
    >
      {completedTxn ? (
        <div className="space-y-5 text-center py-2">
          <div className="w-16 h-16 bg-[#E6F4EE] text-[#218568] rounded-full flex items-center justify-center mx-auto ring-8 ring-[#E6F4EE]/50 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <h4 className="text-xl font-bold text-[#172B3A]">Payment Successful!</h4>
            <p className="text-xs text-[#536473] mt-1">
              Your repayment schedule and loan outstanding have been updated.
            </p>
          </div>

          <div className="bg-[#F5F8FA] border border-[#DFE5E9] rounded-xl p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#DFE5E9]">
              <span className="text-[#536473]">Transaction ID</span>
              <span className="font-mono font-bold text-[#172B3A]">{completedTxn.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#DFE5E9]">
              <span className="text-[#536473]">Receipt Number</span>
              <span className="font-mono text-[#172B3A]">{completedTxn.receiptNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#DFE5E9]">
              <span className="text-[#536473]">Payment Date</span>
              <span className="text-[#172B3A]">{completedTxn.date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#DFE5E9]">
              <span className="text-[#536473]">Payment Method</span>
              <span className="font-semibold text-[#172B3A]">{method}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-bold">
              <span className="text-[#172B3A]">Amount Paid</span>
              <span className="text-[#218568] text-base">{formatINR(completedTxn.amount)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#DFE5E9] text-xs font-semibold text-[#172B3A] hover:bg-[#F3F5F6] transition-colors"
            >
              <Printer className="w-4 h-4 text-[#7B8994]" /> Print Receipt
            </button>
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#612536] hover:bg-[#4C1C2B] text-white text-xs font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePay} className="space-y-5">
          {/* Amount banner */}
          <div className="p-4 bg-[#F5F8FA] rounded-xl border border-[#DFE5E9] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#536473] font-medium">Instalment Amount Due</p>
              <p className="text-2xl font-bold text-[#153755] tabular-nums mt-0.5">
                {formatINR(amount)}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#FFF4D9] text-[#C28A20] rounded-full">
              Pending Due
            </span>
          </div>

          {/* Payment method tabs */}
          <div>
            <label className="block text-xs font-semibold text-[#172B3A] mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('UPI')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  method === 'UPI'
                    ? 'border-[#612536] bg-[#612536]/5 text-[#612536] ring-1 ring-[#612536]'
                    : 'border-[#DFE5E9] hover:border-gray-300 text-[#536473]'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-xs font-semibold">UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('Net Banking')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  method === 'Net Banking'
                    ? 'border-[#612536] bg-[#612536]/5 text-[#612536] ring-1 ring-[#612536]'
                    : 'border-[#DFE5E9] hover:border-gray-300 text-[#536473]'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span className="text-xs font-semibold">Net Banking</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('Debit Card')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  method === 'Debit Card'
                    ? 'border-[#612536] bg-[#612536]/5 text-[#612536] ring-1 ring-[#612536]'
                    : 'border-[#DFE5E9] hover:border-gray-300 text-[#536473]'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-semibold">Debit Card</span>
              </button>
            </div>
          </div>

          {/* Method specific inputs */}
          {method === 'UPI' && (
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Virtual Payment Address (UPI ID)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="name@okhdfcbank"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
                required
              />
              <p className="text-[11px] text-[#536473] mt-1">
                Supports Google Pay, PhonePe, Paytm, and BHIM UPI
              </p>
            </div>
          )}

          {method === 'Net Banking' && (
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Select Your Bank
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE5E9] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536] bg-white text-[#172B3A]"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="State Bank of India">State Bank of India (SBI)</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          {method === 'Debit Card' && (
            <div className="space-y-2.5">
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  defaultValue="4532 •••• •••• 8821"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] font-mono focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    defaultValue="08/28"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] font-mono focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    defaultValue="•••"
                    maxLength={3}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] font-mono focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-[#E6F4EE] rounded-xl border border-[#218568]/20 text-[11px] text-[#218568]">
            ✓ Simulated Sandbox: Payments instantly update the EMI schedule and loan ledger. No real currency is debited.
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#DFE5E9] text-xs font-semibold text-[#172B3A] hover:bg-[#F3F5F6] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#218568] hover:bg-[#1b6b54] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                `Pay ${formatINR(amount)}`
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
