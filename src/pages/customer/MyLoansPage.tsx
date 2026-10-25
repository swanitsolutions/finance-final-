import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api/apiClient';
import { Loan } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters/currency';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PlusCircle, Search, ChevronRight, Calendar, Percent, Clock } from 'lucide-react';

export const MyLoansPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLoans = async () => {
    if (!user) return;
    setLoading(true);
    const res = await apiClient.getLoans();
    setLoading(false);
    if (res.success && res.data) {
      // Filter for this customer
      const myLoans = res.data.filter((l) => l.customerId === user.id);
      setLoans(myLoans);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [user]);

  const filteredLoans = loans.filter((loan) => {
    const matchesStatus = filterStatus === 'all' || loan.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.loanType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loan.purpose && loan.purpose.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172B4D]">My Loans</h2>
          <p className="text-xs text-[#687B94] mt-0.5">
            View and manage all your active, pending, and past credit accounts.
          </p>
        </div>

        <Link
          to="/loans/apply"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5145CD] hover:bg-[#4036B5] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Apply for New Loan</span>
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#DFE7F0] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['all', 'active', 'pending', 'completed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-[#12365A] text-white shadow-2xs'
                  : 'text-[#687B94] hover:bg-gray-100 hover:text-[#172B4D]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
          />
        </div>
      </div>

      {/* Loan Cards Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#687B94]">Loading your loan records...</div>
      ) : filteredLoans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#172B4D]">No Loans Found</h3>
          <p className="text-xs text-[#687B94] leading-relaxed">
            {filterStatus === 'all'
              ? "You haven't submitted any loan applications yet. Ready to fund your goals?"
              : `No loans found matching status "${filterStatus}".`}
          </p>
          <Link
            to="/loans/apply"
            className="inline-block px-5 py-2.5 bg-[#5145CD] hover:bg-[#4036B5] text-white text-xs font-semibold rounded-xl"
          >
            Apply for Loan Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLoans.map((loan) => (
            <div
              key={loan.id}
              className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs hover:border-[#5145CD]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#5145CD] uppercase tracking-wider">
                      {loan.loanType} Loan
                    </span>
                    <h4 className="text-base font-bold text-[#172B4D] font-mono mt-0.5">
                      {loan.id}
                    </h4>
                  </div>
                  <StatusBadge status={loan.status} size="sm" />
                </div>

                <div className="my-4 p-3.5 bg-[#F4F8FC] rounded-xl border border-[#DFE7F0]/80">
                  <span className="text-[10px] text-[#687B94] font-semibold uppercase">
                    Sanctioned Principal
                  </span>
                  <p className="text-xl font-bold text-[#12365A] tabular-nums mt-0.5">
                    {formatINR(loan.principalAmount)}
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#687B94] flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5" /> Interest Rate
                    </span>
                    <span className="font-semibold text-[#172B4D]">{loan.annualInterestRate}% p.a.</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#687B94] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Tenure
                    </span>
                    <span className="font-semibold text-[#172B4D]">{loan.tenureMonths} Months</span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-[#687B94]">Monthly EMI</span>
                    <span className="font-bold text-[#5145CD] tabular-nums">{formatINR(loan.monthlyEmi)}</span>
                  </div>

                  {loan.nextDueDate && loan.status === 'active' && (
                    <div className="flex justify-between pt-1">
                      <span className="text-[#687B94] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#E7A23B]" /> Next Due Date
                      </span>
                      <span className="font-bold text-[#E7A23B]">{formatDate(loan.nextDueDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-gray-100 flex items-center justify-between">
                <Link
                  to={`/loans/${loan.id}`}
                  className="text-xs font-bold text-[#5145CD] hover:underline inline-flex items-center gap-1"
                >
                  View Details & Amortization <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                {loan.status === 'active' && (
                  <Link
                    to="/payments"
                    className="px-3 py-1.5 bg-[#159A78]/10 text-[#159A78] hover:bg-[#159A78]/20 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Pay EMI
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
