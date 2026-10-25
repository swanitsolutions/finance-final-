import React, { useEffect, useState } from 'react';
import { apiClient } from '../../lib/api/apiClient';
import { CustomerProfile } from '../../types';
import { formatINR, formatDate } from '../../lib/formatters/currency';
import { Modal } from '../../components/common/Modal';
import { Search, Users, ShieldCheck, Mail, Phone, MapPin, Eye, Ban, CheckCircle } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    const res = await apiClient.getCustomers();
    setLoading(false);
    if (res.success && res.data) {
      setCustomers(res.data);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      (c.phone && c.phone.includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172B4D]">Customer Directory</h2>
          <p className="text-xs text-[#687B94] mt-0.5">
            Manage KYC compliance, credit scores, and customer borrowing accounts.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30 focus:border-[#5145CD]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-[#DFE7F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFE7F0] text-[#687B94] uppercase tracking-wider text-[11px] bg-[#F4F8FC]">
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Name & Contact</th>
                <th className="py-3 px-4">Credit Score</th>
                <th className="py-3 px-4">Active Loans</th>
                <th className="py-3 px-4">Total Borrowed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#172B4D]">{c.id}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#172B4D]">{c.fullName}</p>
                    <p className="text-[11px] text-[#687B94]">{c.email}</p>
                    <p className="text-[10px] text-gray-400">{c.phone}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold tabular-nums ${
                        c.creditScore >= 750
                          ? 'text-[#159A78]'
                          : c.creditScore >= 700
                          ? 'text-[#5145CD]'
                          : 'text-[#DC5263]'
                      }`}
                    >
                      {c.creditScore}
                      <span className="text-[10px] font-normal text-gray-500">
                        {c.creditScore >= 750 ? '(Prime)' : '(Standard)'}
                      </span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums font-semibold text-[#172B4D]">
                    {c.activeLoansCount}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums font-bold text-[#172B4D]">
                    {formatINR(c.totalBorrowed)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        c.status === 'Active'
                          ? 'bg-[#E7F7F0] text-[#159A78]'
                          : c.status === 'Pending'
                          ? 'bg-[#FFF5DF] text-[#E7A23B]'
                          : 'bg-[#FFF0F1] text-[#DC5263]'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#5145CD] hover:bg-[#5145CD]/10 rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Record: ${selectedCustomer.fullName}`}
          subtitle={`ID: ${selectedCustomer.id} • Registered ${formatDate(selectedCustomer.createdAt)}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#F4F8FC] rounded-xl border border-[#DFE7F0]">
              <div>
                <span className="text-[#687B94] text-[11px]">Primary Email</span>
                <p className="font-semibold text-[#172B4D] mt-0.5">{selectedCustomer.email}</p>
              </div>
              <div>
                <span className="text-[#687B94] text-[11px]">Contact Mobile</span>
                <p className="font-semibold text-[#172B4D] mt-0.5">{selectedCustomer.phone}</p>
              </div>
              <div>
                <span className="text-[#687B94] text-[11px]">Occupation / Designation</span>
                <p className="font-semibold text-[#172B4D] mt-0.5">{selectedCustomer.occupation || 'Salaried Professional'}</p>
              </div>
              <div>
                <span className="text-[#687B94] text-[11px]">Credit Rating</span>
                <p className="font-bold text-[#159A78] mt-0.5">{selectedCustomer.creditScore} (High Quality)</p>
              </div>
              <div className="col-span-2">
                <span className="text-[#687B94] text-[11px]">Residential Address</span>
                <p className="font-medium text-[#172B4D] mt-0.5">{selectedCustomer.address || 'Address provided during onboarding'}</p>
              </div>
            </div>

            <div className="p-3 bg-[#E7F7F0] rounded-xl border border-[#159A78]/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0f5c49]">Total Sanctioned Principal</span>
                <p className="text-xl font-bold text-[#159A78] tabular-nums">
                  {formatINR(selectedCustomer.totalBorrowed)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[#0f5c49]">Lifetime Repaid</span>
                <p className="text-sm font-bold text-[#0f5c49] tabular-nums">
                  {formatINR(selectedCustomer.totalRepaid)}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-[#5145CD] hover:bg-[#4036B5] text-white rounded-xl font-semibold text-xs"
              >
                Close Record
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
