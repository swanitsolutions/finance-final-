import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api/apiClient';
import { SupportTicket } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { formatDate } from '../../lib/formatters/currency';
import {
  HelpCircle,
  MessageSquare,
  PlusCircle,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

const FAQS = [
  {
    q: 'How is reducing-balance EMI computed on LoanEase?',
    a: 'We use the standard Indian banking formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n − 1], where r is the monthly rate (annual percentage rate / 1200). Each month, your interest is calculated solely on the remaining unpaid principal.',
  },
  {
    q: 'How quickly is my loan disbursed after approval?',
    a: 'Approved loans are credited directly to your registered bank account via RTGS/NEFT within 2 to 4 business hours following document completion.',
  },
  {
    q: 'Can I prepay or foreclose my loan ahead of tenure?',
    a: 'Yes, full prepayment and partial payments are supported. Prepayment directly reduces your outstanding principal balance without compounding charges.',
  },
  {
    q: 'Where do I obtain interest certificates for tax deductions?',
    a: 'You can download your provisional and final interest certificates directly from the Loan Details screen or request one via the support ticket form below.',
  },
];

export const SupportPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useNotification();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // New ticket form
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Loan Query');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    if (!user) return;
    setLoading(true);
    const res = await apiClient.getTickets(user.id);
    setLoading(false);
    if (res.success && res.data) {
      setTickets(res.data);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user]);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!subject.trim() || !description.trim()) {
      error('Incomplete Request', 'Please provide a subject and details.');
      return;
    }

    setIsSubmitting(true);
    const res = await apiClient.createTicket({
      customerId: user.id,
      customerName: user.fullName,
      subject,
      category,
      description,
      priority: 'Medium',
    });
    setIsSubmitting(false);

    if (res.success && res.data) {
      success('Ticket Raised', res.message);
      setSubject('');
      setDescription('');
      fetchTickets();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#172B4D]">Help & Customer Support</h2>
        <p className="text-xs text-[#687B94] mt-0.5">
          Frequently asked questions, loan guidance, and 24/7 specialist assistance.
        </p>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#172B4D] flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#5145CD]" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="divide-y divide-gray-100">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-semibold text-xs text-[#172B4D] hover:text-[#5145CD] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#5145CD] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs text-[#687B94] mt-2 leading-relaxed pl-2 border-l-2 border-[#5145CD]">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tickets and New Query Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Submit Ticket Form */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#172B4D] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#5145CD]" />
            <span>Open a Support Query</span>
          </h3>

          <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#172B4D] mb-1">Topic Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFE7F0] bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30"
              >
                <option value="Loan Query">Loan Application & Eligibility</option>
                <option value="Payment Issue">Payment & Reconciliation</option>
                <option value="EMI Calculation">EMI & Interest Calculation</option>
                <option value="General">General Inquiries / Certificate Request</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#172B4D] mb-1">Subject *</label>
              <input
                type="text"
                placeholder="Brief summary of your query"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#172B4D] mb-1">Description *</label>
              <textarea
                rows={3}
                placeholder="Provide specific details including loan account or transaction ID..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-[#5145CD] hover:bg-[#4036B5] text-white font-semibold rounded-xl transition-colors shadow-xs"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>

        {/* Existing Tickets */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#172B4D] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#5145CD]" />
              <span>Your Tickets</span>
            </span>
            <span className="text-xs text-[#687B94] font-normal">({tickets.length})</span>
          </h3>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-3.5 bg-[#F4F8FC] rounded-xl border border-[#DFE7F0] space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#172B4D] text-[11px]">{t.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.status === 'Resolved'
                        ? 'bg-[#E7F7F0] text-[#159A78]'
                        : t.status === 'In Progress'
                        ? 'bg-[#FFF5DF] text-[#E7A23B]'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <h5 className="font-semibold text-[#172B4D]">{t.subject}</h5>
                <p className="text-[11px] text-[#687B94] line-clamp-2">{t.description}</p>
                <p className="text-[10px] text-gray-400 pt-1">{formatDate(t.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
