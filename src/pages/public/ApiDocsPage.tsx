import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';
import { apiClient } from '../../lib/api/apiClient';
import { db } from '../../lib/storage/mockDatabase';
import { 
  Code, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronRight,
  ArrowLeft,
  FileText,
  Server
} from 'lucide-react';

interface Endpoint {
  id: string;
  category: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  authRequired: boolean;
  requiredRole?: string;
  params?: Array<{ name: string; type: string; required: boolean; description: string }>;
  requestBody?: object;
  sampleResponse: object;
}

const ENDPOINTS: Endpoint[] = [
  {
    id: 'auth-login',
    category: 'Authentication',
    method: 'POST',
    path: '/api/v1/auth/login',
    title: 'Authenticate User & Issue Token',
    description: 'Validates user credentials (email or username with password) and returns a signed session token with role claims.',
    authRequired: false,
    requestBody: {
      identifier: 'priya (or admin)',
      password: 'password123 (or admin123)',
    },
    sampleResponse: {
      success: true,
      data: {
        token: 'jwt_token_USR-001_1730000000000',
        user: {
          id: 'USR-001',
          username: 'priya',
          email: 'priya@example.com',
          role: 'customer',
          fullName: 'Priya Sharma',
        },
      },
      message: 'Logged in successfully.',
    },
  },
  {
    id: 'auth-register',
    category: 'Authentication',
    method: 'POST',
    path: '/api/v1/auth/register',
    title: 'Customer Self-Registration',
    description: 'Registers a new customer account, creates user profile and initial credit rating.',
    authRequired: false,
    requestBody: {
      fullName: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      phone: '+91 98111 22233',
      username: 'rahulv',
      password: 'password123',
    },
    sampleResponse: {
      success: true,
      data: {
        user: { id: 'USR-8921', username: 'rahulv', role: 'customer' },
        token: 'jwt_token_USR-8921_1730000000000',
      },
      message: 'Account created successfully! Welcome to LoanEase.',
    },
  },
  {
    id: 'loans-list',
    category: 'Loans & Origination',
    method: 'GET',
    path: '/api/v1/loans',
    title: 'Retrieve Loan Portfolio',
    description: 'Returns all loans associated with the requesting entity or across the institution (for Administrators).',
    authRequired: true,
    requiredRole: 'customer / admin',
    sampleResponse: {
      success: true,
      data: [
        {
          id: 'LN123456',
          customerId: 'USR-001',
          customerName: 'Priya Sharma',
          loanType: 'Personal',
          principalAmount: 200000,
          annualInterestRate: 12,
          tenureMonths: 24,
          monthlyEmi: 9347,
          paidAmount: 60000,
          remainingAmount: 140000,
          status: 'active',
        },
      ],
    },
  },
  {
    id: 'loans-apply',
    category: 'Loans & Origination',
    method: 'POST',
    path: '/api/v1/loans/apply',
    title: 'Submit Loan Application',
    description: 'Submits a new credit facility request with reducing-balance EMI appraisal and employment underwriting criteria.',
    authRequired: true,
    requiredRole: 'customer',
    requestBody: {
      loanType: 'Personal',
      principalAmount: 200000,
      annualInterestRate: 12.0,
      tenureMonths: 24,
      purpose: 'Home renovation',
      employmentType: 'Salaried',
      monthlyIncome: 75000,
    },
    sampleResponse: {
      success: true,
      data: {
        id: 'LN948210',
        status: 'pending',
        monthlyEmi: 9347,
        totalRepayment: 224328,
      },
      message: 'Loan application submitted successfully.',
    },
  },
  {
    id: 'loans-approve',
    category: 'Loans & Origination',
    method: 'POST',
    path: '/api/v1/loans/{loanId}/approve',
    title: 'Underwrite & Approve Loan Facility',
    description: 'Administrative decisioning endpoint to sanction a loan, disburse capital, and generate the amortization schedule.',
    authRequired: true,
    requiredRole: 'admin',
    requestBody: {
      approvedBy: 'Admin Administrator',
    },
    sampleResponse: {
      success: true,
      data: { id: 'LN948210', status: 'active', approvalDate: '2024-10-25' },
      message: 'Loan LN948210 has been successfully approved.',
    },
  },
  {
    id: 'emi-schedule',
    category: 'EMI & Amortization',
    method: 'GET',
    path: '/api/v1/loans/{loanId}/schedule',
    title: 'Retrieve Monthly Amortization Table',
    description: 'Generates the complete reducing-balance repayment schedule with principal vs. interest breakdown for each month.',
    authRequired: true,
    sampleResponse: {
      success: true,
      data: [
        {
          instalmentNumber: 1,
          dueDate: '2024-08-10',
          monthlyEmi: 9347,
          principalComponent: 7347,
          interestComponent: 2000,
          remainingPrincipal: 192653,
          status: 'paid',
        },
      ],
    },
  },
  {
    id: 'payments-record',
    category: 'Payments & Servicing',
    method: 'POST',
    path: '/api/v1/payments/record',
    title: 'Record & Settle EMI Installment',
    description: 'Processes borrower payment transaction via UPI, Net Banking, or Debit Card and reconciles schedule closing balance.',
    authRequired: true,
    requestBody: {
      loanId: 'LN123456',
      instalmentNumber: 4,
      amount: 9347,
      paymentMethod: 'UPI',
    },
    sampleResponse: {
      success: true,
      data: {
        transactionId: 'TXN-98412',
        receiptNumber: 'RCP-20241025-412',
        status: 'Completed',
      },
      message: 'Payment of ₹9,347 processed successfully.',
    },
  },
  {
    id: 'system-backup',
    category: 'System & Security',
    method: 'GET',
    path: '/api/v1/system/backup',
    title: 'Export Relational Database Backup',
    description: 'Exports relational snapshot of users, loans, schedules, transactions, and audit logs formatted in validated JSON.',
    authRequired: true,
    requiredRole: 'admin',
    sampleResponse: {
      success: true,
      data: {
        version: '1.0.0',
        exportedAt: '2024-10-25T15:00:00.000Z',
        tables: { users: 7, loans: 6, transactions: 15, schedules: 1 },
      },
    },
  },
  {
    id: 'system-audit',
    category: 'System & Security',
    method: 'GET',
    path: '/api/v1/audit-logs',
    title: 'Retrieve Audit & Security Logs',
    description: 'Returns chronological immutable security events, auth attempts, policy updates, and financial operations.',
    authRequired: true,
    requiredRole: 'admin',
    sampleResponse: {
      success: true,
      data: [
        {
          id: 'LOG-1001',
          timestamp: '2024-10-25T14:30:12.000Z',
          action: 'SYSTEM_POLICY_UPDATE',
          severity: 'INFO',
          details: 'Benchmark interest rates verified for digital lending compliance.',
        },
      ],
    },
  },
];

export const ApiDocsPage: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS[0]);
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);

  const categories = Array.from(new Set(ENDPOINTS.map(e => e.category)));

  const handleExecute = async () => {
    setIsExecuting(true);
    setTestResponse(null);
    try {
      if (selectedEndpoint.id === 'auth-login') {
        const res = await apiClient.login('priya', 'password123');
        setTestResponse(JSON.stringify(res, null, 2));
      } else if (selectedEndpoint.id === 'loans-list') {
        const res = await apiClient.getLoans();
        setTestResponse(JSON.stringify({ ...res, data: res.data?.slice(0, 2) }, null, 2));
      } else if (selectedEndpoint.id === 'emi-schedule') {
        const res = await apiClient.getLoanSchedule('LN123456');
        setTestResponse(JSON.stringify({ ...res, data: res.data?.slice(0, 3) }, null, 2));
      } else if (selectedEndpoint.id === 'system-backup') {
        const res = await apiClient.exportDatabaseBackup();
        setTestResponse(JSON.stringify({ success: true, filename: res.data?.filename, size: `${res.data?.json.length} bytes` }, null, 2));
      } else if (selectedEndpoint.id === 'system-audit') {
        const res = await apiClient.getAuditLogs();
        setTestResponse(JSON.stringify({ ...res, data: res.data?.slice(0, 3) }, null, 2));
      } else {
        // Sample fallback response
        await new Promise(r => setTimeout(r, 300));
        setTestResponse(JSON.stringify(selectedEndpoint.sampleResponse, null, 2));
      }
    } catch (e: any) {
      setTestResponse(JSON.stringify({ success: false, error: e.message }, null, 2));
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F3F5F6] flex flex-col">
      {/* Top Header */}
      <header className="bg-white border-b border-[#DFE5E9] px-6 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="focus:outline-none">
              <Logo size="md" />
            </Link>
            <div className="h-5 w-[1px] bg-[#DFE5E9] hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#172B3A]">
              <Server className="w-4 h-4 text-[#612536]" />
              <span>RESTful Financial API Specification (v1.0.0)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-[#536473] hover:text-[#172B3A] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/"
              className="px-3.5 py-1.5 bg-[#612536] hover:bg-[#4C1C2B] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Endpoints Tree */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-[#DFE5E9] p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFE5E9] mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#172B3A]">API Endpoints</h2>
              <span className="text-[11px] font-semibold text-[#218568] bg-[#E6F4EE] px-2 py-0.5 rounded-md">
                Base: /api/v1
              </span>
            </div>

            <div className="space-y-4">
              {categories.map(category => (
                <div key={category} className="space-y-1">
                  <p className="text-[11px] font-bold text-[#7B8994] uppercase tracking-wider px-2">
                    {category}
                  </p>
                  <div className="space-y-1">
                    {ENDPOINTS.filter(e => e.category === category).map(endpoint => {
                      const isSelected = selectedEndpoint.id === endpoint.id;
                      return (
                        <button
                          key={endpoint.id}
                          onClick={() => {
                            setSelectedEndpoint(endpoint);
                            setTestResponse(null);
                          }}
                          className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors ${
                            isSelected
                              ? 'bg-[#612536] text-white font-semibold'
                              : 'hover:bg-[#F5F8FA] text-[#172B3A]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                                endpoint.method === 'GET'
                                  ? isSelected ? 'bg-white/20 text-white' : 'bg-[#E6F4EE] text-[#218568]'
                                  : endpoint.method === 'POST'
                                  ? isSelected ? 'bg-white/20 text-white' : 'bg-[#EDF2F5] text-[#153755]'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {endpoint.method}
                            </span>
                            <span className="truncate">{endpoint.path.replace('/api/v1', '')}</span>
                          </div>
                          {endpoint.authRequired && (
                            <Lock className={`w-3 h-3 shrink-0 ${isSelected ? 'text-white/70' : 'text-[#7B8994]'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content: Endpoint Documentation & Live Test */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#DFE5E9]">
              <div className="flex items-center gap-2.5">
                <span
                  className={`text-xs font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    selectedEndpoint.method === 'GET'
                      ? 'bg-[#E6F4EE] text-[#218568]'
                      : 'bg-[#EDF2F5] text-[#153755]'
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <code className="text-sm font-mono font-bold text-[#172B3A]">{selectedEndpoint.path}</code>
              </div>

              <div className="flex items-center gap-2">
                {selectedEndpoint.authRequired ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EDF2F5] text-[#153755] border border-[#DFE5E9]">
                    <Lock className="w-3 h-3 text-[#612536]" />
                    Requires Auth ({selectedEndpoint.requiredRole || 'Bearer'})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E6F4EE] text-[#218568]">
                    <ShieldCheck className="w-3 h-3" /> Public Endpoint
                  </span>
                )}
              </div>
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#172B3A]">{selectedEndpoint.title}</h1>
              <p className="text-xs text-[#536473] mt-1 leading-relaxed">
                {selectedEndpoint.description}
              </p>
            </div>

            {/* Request Body Specification (if applicable) */}
            {selectedEndpoint.requestBody && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#172B3A] uppercase tracking-wider">
                  Request Payload (application/json)
                </h3>
                <div className="relative bg-[#0D2740] rounded-xl p-4 text-xs font-mono text-[#D9E0E5] overflow-x-auto">
                  <pre>{JSON.stringify(selectedEndpoint.requestBody, null, 2)}</pre>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(selectedEndpoint.requestBody, null, 2))}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Copy payload"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Response Specification */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#172B3A] uppercase tracking-wider">
                Expected 200 OK Response Schema
              </h3>
              <div className="bg-[#0D2740] rounded-xl p-4 text-xs font-mono text-[#D9E0E5] overflow-x-auto">
                <pre>{JSON.stringify(selectedEndpoint.sampleResponse, null, 2)}</pre>
              </div>
            </div>

            {/* Interactive Live Sandbox execution */}
            <div className="pt-2 border-t border-[#DFE5E9] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#172B3A]">Live Interactive Sandbox</h3>
                  <p className="text-[11px] text-[#536473]">
                    Execute this endpoint against the in-memory client API engine.
                  </p>
                </div>
                <button
                  onClick={handleExecute}
                  disabled={isExecuting}
                  className="px-4 py-2 bg-[#0D343B] hover:bg-[#082328] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isExecuting ? 'Calling Endpoint...' : 'Send Request'}</span>
                </button>
              </div>

              {testResponse && (
                <div className="bg-[#172B3A] rounded-xl p-4 text-xs font-mono text-[#E8EA68] overflow-x-auto border border-[#DFE5E9]">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-white/70 text-[11px]">
                    <span>STATUS: 200 OK</span>
                    <span>LATENCY: ~180ms</span>
                  </div>
                  <pre>{testResponse}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
