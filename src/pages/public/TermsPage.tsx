import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F4F8FC] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-8 sm:p-12 shadow-xs space-y-6 text-xs text-[#172B4D] leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#5145CD] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#12365A]">Terms & Conditions</h1>
              <p className="text-[#687B94] text-[11px]">Fair Practices Lending Agreement</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#12365A]">1. Eligibility and User Representation</h2>
            <p className="text-[#687B94]">
              Users registering on LoanEase agree that all financial details, employment records, and income statements submitted for loan applications are truthful, verifiable, and accurate.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#12365A]">2. Reducing-Balance EMI Obligations</h2>
            <p className="text-[#687B94]">
              Equated Monthly Instalments are calculated using standard reducing-balance math. Borrowers are responsible for fulfilling scheduled instalments on or before the indicated due date.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#12365A]">3. Loan Sanction & Approval Discretion</h2>
            <p className="text-[#687B94]">
              Application submission does not constitute a legal guarantee of loan disbursement. The lender reserves the right to approve, adjust terms, or reject requests based on credit risk evaluation.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};
