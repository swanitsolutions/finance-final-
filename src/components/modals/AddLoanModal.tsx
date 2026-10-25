import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { calculateEMI } from '../../lib/calculations/emi';
import { formatINR } from '../../lib/formatters/currency';
import { apiClient } from '../../lib/api/apiClient';
import { useNotification } from '../../context/NotificationContext';
import { LoanType } from '../../types';
import { Calculator } from 'lucide-react';

interface AddLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoanCreated?: () => void;
}

export const AddLoanModal: React.FC<AddLoanModalProps> = ({ isOpen, onClose, onLoanCreated }) => {
  const { success, error } = useNotification();

  // Customer Details
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // Loan Details
  const [loanAmount, setLoanAmount] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(12);
  const [tenureMonths, setTenureMonths] = useState<number>(24);
  const [loanType, setLoanType] = useState<LoanType>('Personal');

  // Calculation Results
  const [calculation, setCalculation] = useState(() => calculateEMI(200000, 12, 24));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCalculate = (e?: React.MouseEvent) => {
    e?.preventDefault();
    const result = calculateEMI(loanAmount, interestRate, tenureMonths);
    setCalculation(result);
  };

  const handleSaveLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phoneNumber) {
      error('Missing Information', 'Please complete all required customer fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create user / loan
      const res = await apiClient.createLoanApplication({
        customerId: `USR-NEW-${Date.now().toString().slice(-4)}`,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phoneNumber,
        loanType,
        principalAmount: loanAmount,
        annualInterestRate: interestRate,
        tenureMonths,
        purpose: `Loan issued via Admin panel for ${loanType} finance. Address: ${address}`,
      });

      if (res.success && res.data) {
        // Auto-approve since admin created it directly
        await apiClient.approveLoan(res.data.id, 'Admin Administrator');
        success('Loan Created', `Loan ${res.data.id} created and activated successfully!`);
        onLoanCreated?.();
        onClose();
      } else {
        error('Failed to create loan', res.message || 'Submission error');
      }
    } catch (err) {
      error('Error', 'Failed to create loan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Loan / Customer"
      subtitle="Issue an authorized loan account and generate repayment schedule"
      maxWidth="3xl"
    >
      <form onSubmit={handleSaveLoan} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Details Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#172B4D] pb-1 border-b border-[#DFE7F0]">
              Customer Details
            </h4>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="Enter customer name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Email *
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Address
              </label>
              <textarea
                placeholder="Enter address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
              />
            </div>
          </div>

          {/* Loan Details Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#172B4D] pb-1 border-b border-[#DFE7F0]">
              Loan Details
            </h4>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Loan Amount *
              </label>
              <input
                type="number"
                placeholder="Enter loan amount"
                value={loanAmount}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setLoanAmount(val);
                  setCalculation(calculateEMI(val, interestRate, tenureMonths));
                }}
                min={10000}
                max={10000000}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Interest Rate (%) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 12"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setInterestRate(val);
                    setCalculation(calculateEMI(loanAmount, val, tenureMonths));
                  }}
                  min={1}
                  max={36}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                  Loan Tenure (Months) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 24"
                  value={tenureMonths}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTenureMonths(val);
                    setCalculation(calculateEMI(loanAmount, interestRate, val));
                  }}
                  min={1}
                  max={360}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B4D] mb-1">
                Loan Type *
              </label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value as LoanType)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD] bg-white"
              >
                <option value="Personal">Personal Loan</option>
                <option value="Home">Home Loan</option>
                <option value="Vehicle">Vehicle Loan</option>
                <option value="Education">Education Loan</option>
                <option value="Business">Business Loan</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleCalculate()}
                className="w-full px-3.5 py-2 bg-[#5145CD]/10 text-[#5145CD] hover:bg-[#5145CD]/20 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Calculator className="w-4 h-4" /> Calculate EMI
              </button>
            </div>
          </div>
        </div>

        {/* EMI Calculation Summary Footer */}
        <div className="bg-[#F4F8FC] border border-[#DFE7F0] rounded-xl p-4 grid grid-cols-3 text-center">
          <div>
            <p className="text-[11px] font-semibold text-[#687B94] uppercase tracking-wider">
              Monthly EMI
            </p>
            <p className="text-lg font-bold text-[#172B4D] mt-0.5 tabular-nums">
              {formatINR(calculation.monthlyEmi)}
            </p>
          </div>
          <div className="border-x border-[#DFE7F0]">
            <p className="text-[11px] font-semibold text-[#687B94] uppercase tracking-wider">
              Total Interest
            </p>
            <p className="text-lg font-bold text-[#E7A23B] mt-0.5 tabular-nums">
              {formatINR(calculation.totalInterest)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#687B94] uppercase tracking-wider">
              Total Amount
            </p>
            <p className="text-lg font-bold text-[#159A78] mt-0.5 tabular-nums">
              {formatINR(calculation.totalRepayment)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#DFE7F0] text-xs font-semibold text-[#172B4D] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-[#5145CD] hover:bg-[#4036B5] text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Save Loan'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
