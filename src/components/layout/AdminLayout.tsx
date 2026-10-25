import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileCheck2,
  CalendarClock,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Plus,
  UserCheck,
  RotateCcw,
} from 'lucide-react';
import { AddLoanModal } from '../modals/AddLoanModal';
import { db } from '../../lib/storage/mockDatabase';
import { useNotification } from '../../context/NotificationContext';
import { ApiDocsModal } from '../modals/ApiDocsModal';

export const AdminLayout: React.FC = () => {
  const { user, logout, quickSwitchUser } = useAuth();
  const { success } = useNotification();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addLoanOpen, setAddLoanOpen] = useState(false);
  const [apiDocsOpen, setApiDocsOpen] = useState(false);

  const adminNavItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Customers', to: '/admin/customers', icon: Users },
    { label: 'Loans', to: '/admin/loans', icon: FileCheck2 },
    { label: 'EMI Management', to: '/admin/emi-management', icon: CalendarClock },
    { label: 'Payments', to: '/admin/payments', icon: Receipt },
    { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  const handleResetData = () => {
    db.resetAll();
    success('Data Reset', 'All demonstration metrics and seed data restored.');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] flex text-[#172B4D]">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0B2442]/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#12365A] text-white flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Logo variant="light" size="sm" portalSubtitle="Admin Panel" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin/dashboard'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#5145CD] text-white shadow-xs'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer Demo Controls */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#0B2442]/50">
          <div className="text-[11px] text-white/60 font-semibold uppercase tracking-wider px-1">
            Demo Switcher
          </div>
          <button
            onClick={() => {
              quickSwitchUser('priya');
              navigate('/dashboard');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#159A78]" />
            Switch to Customer View
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-white/70 hover:text-[#DC5263] hover:bg-white/5 rounded-lg text-xs font-medium transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Admin Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DFE7F0] h-20 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#172B4D] hover:bg-gray-100 rounded-lg"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#172B4D]">
                Admin Dashboard
              </h2>
              <p className="text-xs text-[#687B94] hidden sm:block">
                Welcome back, Admin! Here's what's happening today.
              </p>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setApiDocsOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#12365A] bg-[#12365A]/5 hover:bg-[#12365A]/10 rounded-xl transition-colors"
            >
              <span>Swagger API</span>
            </button>

            {/* Quick Add Loan Button */}
            <button
              onClick={() => setAddLoanOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#5145CD] hover:bg-[#4036B5] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Loan</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="w-10 h-10 rounded-xl border border-[#DFE7F0] flex items-center justify-center text-[#172B4D] hover:bg-gray-50 transition-colors"
                aria-label="Admin notifications"
              >
                <Bell className="w-4 h-4 text-[#12365A]" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#159A78] rounded-full ring-2 ring-white" />
              </button>
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-[#DFE7F0]">
              <div className="w-8 h-8 rounded-lg bg-[#12365A] text-white font-bold flex items-center justify-center text-xs">
                A
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-[#172B4D] leading-tight">Admin</p>
                <p className="text-[10px] text-[#687B94] leading-tight">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Add Loan Modal */}
      <AddLoanModal
        isOpen={addLoanOpen}
        onClose={() => setAddLoanOpen(false)}
        onLoanCreated={() => {
          // Re-trigger view update if needed
          window.location.reload();
        }}
      />

      <ApiDocsModal isOpen={apiDocsOpen} onClose={() => setApiDocsOpen(false)} />
    </div>
  );
};
