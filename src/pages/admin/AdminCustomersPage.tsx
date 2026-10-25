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
          <h2 className="text-xl font-bold text-[#172B3A]">Customer Directory</h2>
          <p className="text-xs text-[#536473] mt-0.5">
            Manage KYC compliance, credit scores, and customer borrowing accounts.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#7B8994] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:ring-2 focus:ring-[#612536]/30 focus:border-[#612536]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-[#DFE5E9] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#DFE5E9] text-[#536473] uppercase tracking-wider text-[11px] bg-[#F5F8FA]">
                <th className="py-3 px-4">Customer ID</th>
                <th className="py-3 px-4">Name & Contact</th>
                <th className="py-3 px-4">Credit Score</th>
                <th className="py-3 px-4">Active Loans</th>
                <th className="py-3 px-4">Total Borrowed</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE5E9]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#F5F8FA] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#172B3A]">{c.id}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#172B3A]">{c.fullName}</p>
                    <p className="text-[11px] text-[#536473]">{c.email}</p>
                    <p className="text-[10px] text-[#7B8994]">{c.phone}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold tabular-nums ${
                        c.creditScore >= 750
                          ? 'text-[#218568]'
                          : c.creditScore >= 700
                          ? 'text-[#153755]'
                          : 'text-[#C9414D]'
                      }`}
                    >
                      {c.creditScore}
                      <span className="text-[10px] font-normal text-[#536473]">
                        {c.creditScore >= 750 ? '(Prime)' : '(Standard)'}
                      </span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 tabular-nums font-semibold text-[#172B3A]">
                    {c.activeLoansCount}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums font-bold text-[#172B3A]">
                    {formatINR(c.totalBorrowed)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        c.status === 'Active'
                          ? 'bg-[#E6F4EE] text-[#218568]'
                          : c.status === 'Pending'
                          ? 'bg-[#FFF4D9] text-[#C28A20]'
                          : 'bg-[#FCEBED] text-[#C9414D]'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(c)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#612536] hover:bg-[#612536]/10 rounded-lg transition-colors inline-flex items-center gap-1"
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
            <div className="grid grid-cols-2 gap-4 p-4 bg-[#F5F8FA] rounded-xl border border-[#DFE5E9]">
              <div>
                <span className="text-[#536473] text-[11px]">Primary Email</span>
                <p className="font-semibold text-[#172B3A] mt-0.5">{selectedCustomer.email}</p>
              </div>
              <div>
                <span className="text-[#536473] text-[11px]">Contact Mobile</span>
                <p className="font-semibold text-[#172B3A] mt-0.5">{selectedCustomer.phone}</p>
              </div>
              <div>
                <span className="text-[#536473] text-[11px]">Occupation / Designation</span>
                <p className="font-semibold text-[#172B3A] mt-0.5">{selectedCustomer.occupation || 'Salaried Professional'}</p>
              </div>
              <div>
                <span className="text-[#536473] text-[11px]">Credit Rating</span>
                <p className="font-bold text-[#218568] mt-0.5">{selectedCustomer.creditScore} (High Quality)</p>
              </div>
              <div className="col-span-2">
                <span className="text-[#536473] text-[11px]">Residential Address</span>
                <p className="font-medium text-[#172B3A] mt-0.5">{selectedCustomer.address || 'Address provided during onboarding'}</p>
              </div>
            </div>

            <div className="p-3 bg-[#E6F4EE] rounded-xl border border-[#218568]/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#218568]">Total Sanctioned Principal</span>
                <p className="text-xl font-bold text-[#218568] tabular-nums">
                  {formatINR(selectedCustomer.totalBorrowed)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-[#218568]">Lifetime Repaid</span>
                <p className="text-sm font-bold text-[#218568] tabular-nums">
                  {formatINR(selectedCustomer.totalRepaid)}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-[#612536] hover:bg-[#4C1C2B] text-white rounded-xl font-semibold text-xs"
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
