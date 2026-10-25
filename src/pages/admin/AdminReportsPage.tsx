import React, { useState } from 'react';
import { formatINR } from '../../lib/formatters/currency';
import { Download, Printer, BarChart3, TrendingUp, ShieldAlert, CheckCircle2 } from 'lucide-react';
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
} from 'recharts';

export const AdminReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('2024-Q3');

  const portfolioByType = [
    { type: 'Personal', count: 45, principal: 1850000, color: '#5145CD' },
    { type: 'Home', count: 22, principal: 1950000, color: '#159A78' },
    { type: 'Vehicle', count: 18, principal: 650000, color: '#2588D8' },
    { type: 'Business', count: 13, principal: 400000, color: '#E7A23B' },
  ];

  const collectionsByMonth = [
    { month: 'May', collected: 320000, projected: 330000 },
    { month: 'Jun', collected: 410000, projected: 415000 },
    { month: 'Jul', collected: 490000, projected: 490000 },
    { month: 'Aug', collected: 540000, projected: 550000 },
    { month: 'Sep', collected: 620000, projected: 630000 },
    { month: 'Oct', collected: 685000, projected: 690000 },
  ];

  const handleExportSummaryCSV = () => {
    const headers = ['Category', 'Active Accounts', 'Total Portfolio Principal'];
    const rows = portfolioByType.map((p) => [p.type, p.count, p.principal]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LoanEase_Portfolio_Report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#172B4D]">Portfolio Reports & Analytics</h2>
          <p className="text-xs text-[#687B94] mt-0.5">
            Institutional portfolio health, repayment velocity, and yield analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSummaryCSV}
            className="px-3.5 py-2 bg-white border border-[#DFE7F0] hover:bg-gray-50 rounded-xl text-xs font-semibold text-[#172B4D] flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#5145CD]" />
            <span>Export Report (CSV)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white border border-[#DFE7F0] hover:bg-gray-50 rounded-xl text-xs font-semibold text-[#172B4D] flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#687B94]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-[#687B94] uppercase tracking-wider">
            Total Loan Book
          </span>
          <p className="text-2xl font-bold text-[#172B4D] tabular-nums mt-1">₹ 48,50,000</p>
          <p className="text-xs text-[#159A78] mt-1 font-medium">+7.2% quarterly growth</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-[#687B94] uppercase tracking-wider">
            Total Collections
          </span>
          <p className="text-2xl font-bold text-[#159A78] tabular-nums mt-1">₹ 14,25,000</p>
          <p className="text-xs text-[#687B94] mt-1">98.4% timely clearing rate</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-[#687B94] uppercase tracking-wider">
            Gross NPA / Default Risk
          </span>
          <p className="text-2xl font-bold text-[#DC5263] tabular-nums mt-1">1.8%</p>
          <p className="text-xs text-[#159A78] mt-1 font-medium">Well below 4.0% industry threshold</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-5 shadow-xs">
          <span className="text-[11px] font-semibold text-[#687B94] uppercase tracking-wider">
            Average Portfolio Yield
          </span>
          <p className="text-2xl font-bold text-[#5145CD] tabular-nums mt-1">11.4% p.a.</p>
          <p className="text-xs text-[#687B94] mt-1">Reducing balance annualized</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Collections Trend Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#172B4D]">Monthly Repayment Collections (INR)</h3>
              <p className="text-xs text-[#687B94]">Realized collections vs projected schedule</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E7F7F0] text-[#159A78]">
              FY 2024-25
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collectionsByMonth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f3f6" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#687B94' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#687B94' }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), 'Amount']}
                  contentStyle={{ backgroundColor: '#12365A', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="collected" fill="#5145CD" radius={[4, 4, 0, 0]} name="Actual Collections" />
                <Bar dataKey="projected" fill="#DFE7F0" radius={[4, 4, 0, 0]} name="Projected Schedule" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio by Loan Type Pie Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172B4D]">Portfolio by Loan Category</h3>
            <p className="text-xs text-[#687B94] mb-2">Exposure across financing categories</p>

            <div className="relative h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioByType}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="principal"
                  >
                    {portfolioByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatINR(Number(val)), 'Principal']}
                    contentStyle={{ backgroundColor: '#12365A', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
            {portfolioByType.map((item) => (
              <div key={item.type} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-[#172B4D]">{item.type} Loans</span>
                </div>
                <div className="text-right">
                  <span className="font-bold tabular-nums text-[#172B4D]">{formatINR(item.principal)}</span>
                  <span className="text-[11px] text-[#687B94] ml-2">({item.count} loans)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
