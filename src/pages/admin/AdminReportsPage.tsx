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
    { type: 'Personal', count: 45, principal: 1850000, color: '#612536' },
    { type: 'Home', count: 22, principal: 1950000, color: '#218568' },
    { type: 'Vehicle', count: 18, principal: 650000, color: '#0D343B' },
    { type: 'Business', count: 13, principal: 400000, color: '#E65327' },
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
          <h2 className="text-xl font-bold text-[#172B3A]">Portfolio Reports & Analytics</h2>
          <p className="text-xs text-[#536473] mt-0.5">
            Institutional portfolio health, repayment velocity, and yield analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSummaryCSV}
            className="px-3.5 py-2 bg-white border border-[#DFE5E9] hover:bg-[#F3F5F6] rounded-xl text-xs font-semibold text-[#172B3A] flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#612536]" />
            <span>Export Report (CSV)</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-white border border-[#DFE5E9] hover:bg-[#F3F5F6] rounded-xl text-xs font-semibold text-[#172B3A] flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#7B8994]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0D343B] text-white rounded-2xl p-5 shadow-xs border border-[#0D343B]">
          <span className="text-[11px] font-semibold text-[#D9E0E5] uppercase tracking-wider">
            Total Loan Book
          </span>
          <p className="text-2xl font-bold text-white tabular-nums mt-1">₹ 48,50,000</p>
          <p className="text-xs text-[#E8EA68] mt-1 font-medium">+7.2% quarterly growth</p>
        </div>

        <div className="bg-[#6B751B] text-white rounded-2xl p-5 shadow-xs border border-[#6B751B]">
          <span className="text-[11px] font-semibold text-[#D9E0E5] uppercase tracking-wider">
            Total Collections
          </span>
          <p className="text-2xl font-bold text-white tabular-nums mt-1">₹ 14,25,000</p>
          <p className="text-xs text-white/90 mt-1">98.4% timely clearing rate</p>
        </div>

        <div className="bg-[#E65327] text-white rounded-2xl p-5 shadow-xs border border-[#E65327]">
          <span className="text-[11px] font-semibold text-[#D9E0E5] uppercase tracking-wider">
            Gross NPA / Default Risk
          </span>
          <p className="text-2xl font-bold text-white tabular-nums mt-1">1.8%</p>
          <p className="text-xs text-white/90 mt-1 font-medium">Well below 4.0% industry threshold</p>
        </div>

        <div className="bg-[#E8EA68] text-[#0D2740] rounded-2xl p-5 shadow-xs border border-[#DFE5E9]">
          <span className="text-[11px] font-semibold text-[#0D2740]/80 uppercase tracking-wider">
            Average Portfolio Yield
          </span>
          <p className="text-2xl font-bold text-[#0D2740] tabular-nums mt-1">11.4% p.a.</p>
          <p className="text-xs text-[#0D2740]/80 mt-1">Reducing balance annualized</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Collections Trend Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#172B3A]">Monthly Repayment Collections (INR)</h3>
              <p className="text-xs text-[#536473]">Realized collections vs projected schedule</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#E6F4EE] text-[#218568]">
              FY 2024-25
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collectionsByMonth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DFE5E9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#7B8994' }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#7B8994' }}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), 'Amount']}
                  contentStyle={{ backgroundColor: '#0D2740', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Bar dataKey="collected" fill="#218568" radius={[4, 4, 0, 0]} name="Actual Collections" />
                <Bar dataKey="projected" fill="#DFE5E9" radius={[4, 4, 0, 0]} name="Projected Schedule" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio by Loan Type Pie Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#172B3A]">Portfolio by Loan Category</h3>
            <p className="text-xs text-[#536473] mb-2">Exposure across financing categories</p>

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
                    contentStyle={{ backgroundColor: '#0D2740', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 text-xs border-t border-[#DFE5E9] pt-3">
            {portfolioByType.map((item) => (
              <div key={item.type} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-[#172B3A]">{item.type} Loans</span>
                </div>
                <div className="text-right">
                  <span className="font-bold tabular-nums text-[#172B3A]">{formatINR(item.principal)}</span>
                  <span className="text-[11px] text-[#536473] ml-2">({item.count} loans)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
