import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/api/apiClient';
import { MetricCard } from '../../components/common/MetricCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatINR, formatDate } from '../../lib/formatters/currency';
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Receipt,
  FileCheck2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      const res = await apiClient.getAdminDashboard();
      setLoading(false);
      if (res.success && res.data) {
        setData(res.data);
      }
    };
    fetchAdminData();
  }, []);

  if (loading || !data) {
    return <div className="py-20 text-center text-xs text-[#687B94]">Loading administrator metrics...</div>;
  }

  // Loan status doughnut chart data
  const statusPieData = [
    { name: 'Active', value: 68, color: '#159A78' },
    { name: 'Completed', value: 25, color: '#2588D8' },
    { name: 'Overdue', value: 7, color: '#DC5263' },
  ];

  return (
    <div className="space-y-6">
      {/* 4 Summary Cards (matches Reference Image 1 bottom dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Customers"
          value={data.metrics.totalCustomers} // 125
          trendText="+ 5% from last month"
          trendPositive={true}
          icon={<Users className="w-6 h-6" />}
          iconBgColor="bg-cyan-100"
          iconColor="text-cyan-700"
        />

        <MetricCard
          title="Active Loans"
          value={data.metrics.activeLoans} // 98
          trendText="+ 8% from last month"
          trendPositive={true}
          icon={<CheckCircle2 className="w-6 h-6" />}
          iconBgColor="bg-[#E7F7F0]"
          iconColor="text-[#159A78]"
        />

        <MetricCard
          title="Completed Loans"
          value={data.metrics.completedLoans} // 42
          trendText="+ 12% from last month"
          trendPositive={true}
          icon={<Clock className="w-6 h-6" />}
          iconBgColor="bg-rose-100"
          iconColor="text-rose-600"
        />

        <MetricCard
          title="Total Loan Amount"
          value={formatINR(data.metrics.totalLoanPrincipal)} // ₹ 48,50,000
          trendText="+ 7% from last month"
          trendPositive={true}
          icon={<Receipt className="w-6 h-6" />}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Middle Row: Applications Bar Chart + Loan Status Doughnut + Recent Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Loan Applications Bar Chart (Left 5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#172B4D]">Loan Applications</h3>
                <p className="text-[11px] text-[#687B94]">Monthly trend breakdown</p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1 font-medium text-[#172B4D]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#159A78]" /> Approved
                </span>
                <span className="flex items-center gap-1 font-medium text-[#172B4D]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5145CD]" /> Pending
                </span>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyApplications} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f3f6" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#687B94' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#687B94' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#12365A',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="approved" fill="#159A78" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" fill="#5145CD" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Loan Status Doughnut Chart (Middle 3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172B4D] mb-1">Loan Status</h3>
            <p className="text-[11px] text-[#687B94] mb-3">Portfolio distribution</p>

            <div className="relative h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-[#172B4D] tabular-nums">98</span>
                <span className="text-[10px] font-semibold text-[#687B94]">Total Loans</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-xs pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-[#687B94]">
                <span className="w-2 h-2 rounded-full bg-[#159A78]" /> Active
              </span>
              <span className="font-bold text-[#172B4D]">68%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-[#687B94]">
                <span className="w-2 h-2 rounded-full bg-[#2588D8]" /> Completed
              </span>
              <span className="font-bold text-[#172B4D]">25%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-[#687B94]">
                <span className="w-2 h-2 rounded-full bg-[#DC5263]" /> Overdue
              </span>
              <span className="font-bold text-[#DC5263]">7%</span>
            </div>
          </div>
        </div>

        {/* Recent Customers Table (Right 4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#172B4D]">Recent Customers</h3>
              <Link to="/admin/customers" className="text-xs font-semibold text-[#5145CD] hover:underline">
                View All
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {data.recentCustomers.map((cust: any) => (
                <div key={cust.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#172B4D]">{cust.name}</p>
                    <p className="text-[11px] text-[#687B94]">{cust.email}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="font-bold text-[#172B4D] tabular-nums">
                      {formatINR(cust.loanAmount)}
                    </span>
                    <StatusBadge status={cust.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100">
            <Link
              to="/admin/customers"
              className="text-xs font-semibold text-[#5145CD] hover:underline flex items-center justify-center gap-1"
            >
              Manage All Customers <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming EMI Payments + Overdue Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming EMI Payments */}
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172B4D]">Upcoming EMI Payments</h3>
            <Link to="/admin/emi-management" className="text-xs font-semibold text-[#5145CD] hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#DFE7F0] text-[#687B94] uppercase tracking-wider text-[11px] bg-[#F4F8FC]/60">
                  <th className="py-2.5 px-3">Customer Name</th>
                  <th className="py-2.5 px-3">Loan ID</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.upcomingEmiPayments.map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-50/70">
                    <td className="py-3 px-3 font-semibold text-[#172B4D]">{p.customerName}</td>
                    <td className="py-3 px-3 font-mono text-[#5145CD]">{p.loanId}</td>
                    <td className="py-3 px-3 font-bold tabular-nums text-[#172B4D]">{formatINR(p.amount)}</td>
                    <td className="py-3 px-3 text-[#687B94]">{formatDate(p.dueDate)}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={p.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Overdue Payments */}
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#172B4D] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#DC5263]" />
              <span>Overdue Payments</span>
            </h3>
            <Link to="/admin/reports" className="text-xs font-semibold text-[#5145CD] hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#DFE7F0] text-[#687B94] uppercase tracking-wider text-[11px] bg-[#FFF0F1]/40">
                  <th className="py-2.5 px-3">Customer Name</th>
                  <th className="py-2.5 px-3">Loan ID</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Days Overdue</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.overduePayments.map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-rose-50/30">
                    <td className="py-3 px-3 font-semibold text-[#172B4D]">{p.customerName}</td>
                    <td className="py-3 px-3 font-mono text-[#DC5263]">{p.loanId}</td>
                    <td className="py-3 px-3 font-bold tabular-nums text-[#DC5263]">{formatINR(p.amount)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF0F1] text-[#DC5263]">
                        {p.daysOverdue} days
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => alert(`Notice reminder dispatched to ${p.customerName} for ${p.loanId}`)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#DC5263] hover:bg-[#b83e4d] rounded-lg transition-colors"
                      >
                        Send Notice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
