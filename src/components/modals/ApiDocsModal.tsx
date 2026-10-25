import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Code, CheckCircle, Copy } from 'lucide-react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EndpointDoc {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH';
  path: string;
  description: string;
  authRequired: boolean;
  sampleRequest?: object;
  sampleResponse: object;
}

const ENDPOINTS: EndpointDoc[] = [
  {
    method: 'POST',
    path: '/api/v1/auth/register/',
    description: 'Register a new customer account with password hashing',
    authRequired: false,
    sampleRequest: {
      fullName: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98765 43210',
      username: 'priya',
      password: 'password123',
    },
    sampleResponse: {
      success: true,
      data: {
        user: { id: 'USR-001', username: 'priya', role: 'customer' },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login/',
    description: 'Authenticate user with credentials and issue JWT tokens',
    authRequired: false,
    sampleRequest: {
      username: 'priya',
      password: 'password123',
    },
    sampleResponse: {
      success: true,
      data: {
        token: 'jwt_token_USR-001_1729864200',
        user: { id: 'USR-001', role: 'customer', fullName: 'Priya Sharma' },
      },
    },
  },
  {
    method: 'GET',
    path: '/api/v1/loans/',
    description: 'Retrieve loans (customer scoped to self, admin retrieves all)',
    authRequired: true,
    sampleResponse: [
      {
        id: 'LN123456',
        loanType: 'Personal',
        principalAmount: 200000,
        annualInterestRate: 12,
        tenureMonths: 24,
        monthlyEmi: 9347,
        status: 'active',
        paidAmount: 60000,
        remainingAmount: 140000,
      },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/loans/',
    description: 'Submit a new loan application',
    authRequired: true,
    sampleRequest: {
      loanType: 'Personal',
      principalAmount: 200000,
      annualInterestRate: 12,
      tenureMonths: 24,
      purpose: 'Home renovation',
    },
    sampleResponse: {
      success: true,
      data: {
        id: 'LN948210',
        status: 'pending',
        monthlyEmi: 9347,
      },
    },
  },
  {
    method: 'POST',
    path: '/api/v1/loans/{id}/approve/',
    description: 'Admin action: Approve application and generate amortization schedule',
    authRequired: true,
    sampleResponse: {
      success: true,
      message: 'Loan LN123456 has been approved and marked active.',
    },
  },
  {
    method: 'GET',
    path: '/api/v1/loans/{id}/schedule/',
    description: 'Get month-by-month reducing-balance amortization schedule',
    authRequired: true,
    sampleResponse: [
      {
        instalmentNumber: 1,
        dueDate: '2024-08-10',
        principalComponent: 7347,
        interestComponent: 2000,
        monthlyEmi: 9347,
        status: 'paid',
      },
    ],
  },
  {
    method: 'POST',
    path: '/api/v1/payments/initiate/',
    description: 'Record an EMI instalment payment and update loan ledger',
    authRequired: true,
    sampleRequest: {
      loanId: 'LN123456',
      instalmentNumber: 4,
      amount: 9347,
      paymentMethod: 'UPI',
    },
    sampleResponse: {
      success: true,
      data: {
        id: 'TXN-90214',
        receiptNumber: 'RCP-20241010-412',
        status: 'Completed',
      },
    },
  },
];

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="LoanEase REST API & Swagger Contracts"
      subtitle="Django 5.x REST Framework specification (v1) with JWT authentication"
      maxWidth="3xl"
    >
      <div className="space-y-4">
        <div className="p-3 bg-[#12365A]/5 border border-[#12365A]/15 rounded-xl text-xs text-[#12365A] flex items-center justify-between">
          <div>
            <span className="font-semibold">Base URL: </span>
            <code className="bg-white px-2 py-0.5 rounded border border-[#DFE7F0]">
              {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}
            </code>
          </div>
          <span className="text-[11px] font-medium text-[#159A78] bg-[#E7F7F0] px-2 py-0.5 rounded">
            Mock Adapter Active
          </span>
        </div>

        <div className="space-y-3">
          {ENDPOINTS.map((ep, idx) => (
            <div
              key={idx}
              className="border border-[#DFE7F0] rounded-xl p-4 bg-white hover:border-[#5145CD]/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded ${
                      ep.method === 'GET'
                        ? 'bg-blue-100 text-blue-700'
                        : ep.method === 'POST'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <code className="text-sm font-semibold text-[#172B4D]">{ep.path}</code>
                </div>
                {ep.authRequired && (
                  <span className="text-[10px] uppercase font-semibold text-[#687B94] bg-gray-100 px-1.5 py-0.5 rounded">
                    JWT Bearer
                  </span>
                )}
              </div>

              <p className="text-xs text-[#687B94] mb-3">{ep.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {ep.sampleRequest && (
                  <div>
                    <span className="text-[10px] font-semibold text-[#687B94] uppercase tracking-wider block mb-1">
                      Request Payload
                    </span>
                    <pre className="bg-[#0B2442] text-gray-200 p-2.5 rounded-lg text-[11px] overflow-x-auto max-h-36">
                      {JSON.stringify(ep.sampleRequest, null, 2)}
                    </pre>
                  </div>
                )}
                <div className={ep.sampleRequest ? '' : 'md:col-span-2'}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold text-[#687B94] uppercase tracking-wider">
                      Response (200 OK)
                    </span>
                    <button
                      onClick={() => handleCopy(JSON.stringify(ep.sampleResponse, null, 2), idx)}
                      className="text-[10px] text-gray-500 hover:text-[#5145CD] flex items-center gap-1"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-[#159A78]" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-[#0B2442] text-emerald-400 p-2.5 rounded-lg text-[11px] overflow-x-auto max-h-36">
                    {JSON.stringify(ep.sampleResponse, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
