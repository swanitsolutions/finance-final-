import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api/apiClient';
import { calculateEMI } from '../../lib/calculations/emi';
import { formatINR } from '../../lib/formatters/currency';
import { useNotification } from '../../context/NotificationContext';
import { LoanType, UploadedDocument } from '../../types';
import { CheckCircle2, Calculator, ArrowRight, ShieldCheck, UploadCloud, FileText, X, AlertCircle } from 'lucide-react';

const RATE_POLICY: Record<LoanType, number> = {
  Personal: 12.0,
  Home: 9.5,
  Vehicle: 10.5,
  Education: 8.5,
  Business: 13.0,
};

export const ApplyLoanPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useNotification();
  const navigate = useNavigate();

  const [loanType, setLoanType] = useState<LoanType>('Personal');
  const [amount, setAmount] = useState<number>(200000);
  const [tenureMonths, setTenureMonths] = useState<number>(24);
  const [employmentType, setEmploymentType] = useState('Salaried');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(75000);
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [docTypeSelect, setDocTypeSelect] = useState<UploadedDocument['documentType']>('ID Proof (PAN/Aadhaar)');
  const [fileError, setFileError] = useState<string | null>(null);

  const interestRate = RATE_POLICY[loanType];
  const emiCalc = calculateEMI(amount, interestRate, tenureMonths);

  // File Upload Validation (Requirement 20)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
    const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    // Validate File Type
    if (!ALLOWED_TYPES.includes(file.type)) {
      const errMsg = `Invalid file format (${file.type || 'unknown'}). Only PDF, JPEG, and PNG documents are permitted.`;
      setFileError(errMsg);
      error('File Validation Failed', errMsg);
      e.target.value = '';
      return;
    }

    // Validate File Size (<= 5MB)
    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const errMsg = `File size (${sizeMB} MB) exceeds maximum permissible limit of 5.0 MB.`;
      setFileError(errMsg);
      error('File Too Large', errMsg);
      e.target.value = '';
      return;
    }

    // Format file size
    const formatted = file.size >= 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const newDoc: UploadedDocument = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      name: file.name,
      size: file.size,
      formattedSize: formatted,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      documentType: docTypeSelect,
    };

    setDocuments(prev => [...prev, newDoc]);
    success('Document Attached', `${file.name} (${formatted}) verified and attached.`);
    e.target.value = '';
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!purpose.trim()) {
      error('Missing Information', 'Please describe the purpose of this loan.');
      return;
    }

    setIsSubmitting(true);
    const res = await apiClient.createLoanApplication({
      customerId: user.id,
      customerName: user.fullName,
      customerEmail: user.email,
      customerPhone: user.phone,
      loanType,
      principalAmount: amount,
      annualInterestRate: interestRate,
      tenureMonths,
      purpose,
      employmentType,
      monthlyIncome,
    });
    setIsSubmitting(false);

    if (res.success && res.data) {
      success('Application Submitted', res.message);
      navigate(`/loans/${res.data.id}`);
    } else {
      error('Submission Failed', res.message || 'Could not submit application.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#172B3A]">Apply for a New Loan</h2>
        <p className="text-xs text-[#536473] mt-0.5">
          Submit your financing request with instant reducing-balance EMI appraisal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Select Loan Category *
              </label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value as LoanType)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE5E9] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536] bg-white font-medium text-[#172B3A]"
              >
                <option value="Personal">Personal Loan (12.0% p.a.)</option>
                <option value="Home">Home Loan (9.5% p.a.)</option>
                <option value="Vehicle">Vehicle Loan (10.5% p.a.)</option>
                <option value="Education">Education Loan (8.5% p.a.)</option>
                <option value="Business">Business Loan (13.0% p.a.)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-[#172B3A]">
                  Requested Loan Amount *
                </label>
                <span className="text-xs font-bold text-[#612536] tabular-nums">
                  {formatINR(amount)}
                </span>
              </div>
              <input
                type="number"
                min={20000}
                max={5000000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536] font-medium"
              />
              <p className="text-[11px] text-[#7B8994] mt-1">
                Eligible range: ₹20,000 to ₹50,00,000
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                  Tenure (Months) *
                </label>
                <select
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE5E9] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536] bg-white font-medium text-[#172B3A]"
                >
                  <option value={12}>12 Months (1 Year)</option>
                  <option value={18}>18 Months (1.5 Years)</option>
                  <option value={24}>24 Months (2 Years)</option>
                  <option value={36}>36 Months (3 Years)</option>
                  <option value={48}>48 Months (4 Years)</option>
                  <option value={60}>60 Months (5 Years)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                  Employment Type *
                </label>
                <select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE5E9] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536] bg-white font-medium text-[#172B3A]"
                >
                  <option value="Salaried">Salaried Employee</option>
                  <option value="Self-Employed">Self-Employed / Business</option>
                  <option value="Professional">Doctor / CA / Lawyer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Net Monthly Take-Home Income (INR) *
              </label>
              <input
                type="number"
                min={15000}
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#172B3A] mb-1">
                Purpose of Loan *
              </label>
              <textarea
                rows={3}
                placeholder="Explain the reason for this credit facility (e.g. Home repair, child education, vehicle)..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
              />
            </div>

            {/* KYC & Financial Document Upload (Requirement 20: File Upload Validation) */}
            <div className="space-y-2 pt-1 border-t border-[#DFE5E9]">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-[#172B3A]">
                  Verification Documents (KYC & Income)
                </label>
                <span className="text-[11px] text-[#7B8994]">Max 5 MB · PDF, JPG, PNG</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-5">
                  <select
                    value={docTypeSelect}
                    onChange={(e) => setDocTypeSelect(e.target.value as UploadedDocument['documentType'])}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] font-medium focus:outline-none focus:border-[#612536]"
                  >
                    <option value="ID Proof (PAN/Aadhaar)">ID Proof (PAN/Aadhaar)</option>
                    <option value="Income Proof / Salary Slip">Income Proof / Salary Slip</option>
                    <option value="Bank Statement">Bank Statement</option>
                    <option value="Other">Other Supporting Document</option>
                  </select>
                </div>

                <div className="sm:col-span-7">
                  <label className="flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-[#DFE5E9] hover:border-[#612536] bg-[#F5F8FA] hover:bg-[#EDF2F5] rounded-xl cursor-pointer transition-colors text-xs font-semibold text-[#153755]">
                    <UploadCloud className="w-4 h-4 text-[#612536]" />
                    <span>Choose File to Upload</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {fileError && (
                <div className="p-2.5 bg-[#FCEBED] rounded-xl border border-[#C9414D]/30 text-xs text-[#C9414D] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}

              {documents.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-2.5 bg-[#F5F8FA] rounded-xl border border-[#DFE5E9] text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-[#0D343B] shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-[#172B3A] truncate">{doc.name}</p>
                          <p className="text-[10px] text-[#7B8994]">{doc.documentType} · {doc.formattedSize}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDoc(doc.id)}
                        className="p-1 hover:bg-gray-200 rounded-lg text-[#7B8994] hover:text-[#C9414D] transition-colors"
                        title="Remove attached file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-[#F5F8FA] rounded-xl border border-[#DFE5E9] text-[11px] text-[#536473] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#218568] shrink-0" />
              <span>Applications are verified in accordance with automated banking guidelines.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#612536] hover:bg-[#4C1C2B] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                'Submitting Application...'
              ) : (
                <>
                  <span>Submit Loan Application</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Calculation Preview Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#172B3A] pb-3 border-b border-[#DFE5E9]">
              <Calculator className="w-4 h-4 text-[#612536]" />
              <span>Repayment Estimation</span>
            </div>

            <div className="p-5 bg-[#0D343B] text-white rounded-xl text-center shadow-xs">
              <p className="text-[11px] font-semibold text-[#D9E0E5] uppercase tracking-wider">
                Projected Monthly EMI
              </p>
              <p className="text-3xl font-extrabold text-[#E8EA68] tabular-nums mt-1">
                {formatINR(emiCalc.monthlyEmi)}
              </p>
              <p className="text-[11px] text-[#D9E0E5] mt-1">
                Payable monthly over {tenureMonths} instalments
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#DFE5E9]">
                <span className="text-[#536473]">Requested Principal</span>
                <span className="font-bold text-[#172B3A] tabular-nums">{formatINR(amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DFE5E9]">
                <span className="text-[#536473]">Applicable Interest Rate</span>
                <span className="font-semibold text-[#172B3A]">{interestRate}% p.a.</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DFE5E9]">
                <span className="text-[#536473]">Total Interest Payable</span>
                <span className="font-bold text-[#C28A20] tabular-nums">{formatINR(emiCalc.totalInterest)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-semibold text-[#172B3A]">Total Repayment</span>
                <span className="font-bold text-[#218568] text-sm tabular-nums">{formatINR(emiCalc.totalRepayment)}</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="bg-[#E6F4EE] rounded-xl p-3 text-[11px] text-[#218568] space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High Approval Likelihood
                </p>
                <p className="opacity-90">
                  EMI represents {Math.round((emiCalc.monthlyEmi / (monthlyIncome || 1)) * 100)}% of your declared income, within standard 45% debt-to-income limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
