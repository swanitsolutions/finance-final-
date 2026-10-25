import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F4F8FC] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-8 sm:p-12 shadow-xs space-y-6 text-xs text-[#172B4D] leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-[#E7F7F0] text-[#159A78] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#12365A]">Privacy Policy</h1>
              <p className="text-[#687B94] text-[11px]">Last Updated: October 2024</p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#12365A]">1. Commitment to Data Protection</h2>
            <p className="text-[#687B94]">
              LoanEase Technologies is committed to safeguarding the privacy and financial information of all users. This Privacy Policy details how we handle personal identifiers, financial application data, and transaction records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#12365A]">2. Information We Collect</h2>
            <p className="text-[#687B94]">
              We collect information provided directly during registration and loan applications, including legal full names, contact email addresses, mobile numbers, employment categories, and financial requests necessary to determine credit eligibility.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#12365A]">3. Cryptographic Storage & Security</h2>
            <p className="text-[#687B94]">
              Passwords are cryptographically salted and hashed before persistence. Sensitive financial access is authorized via short-lived JWT credentials with strict role-based access control.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-[#12365A]">4. Non-Disclosure & Regulatory Compliance</h2>
            <p className="text-[#687B94]">
              We never sell or distribute personal financial profiles to external marketing brokers. Data is processed solely for credit evaluation and loan account maintenance.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};
