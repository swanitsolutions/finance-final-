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
} from 'lucide-react';
import { AddLoanModal } from '../modals/AddLoanModal';

export const AdminLayout: React.FC = () => {
  const { user, logout, quickSwitchUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addLoanOpen, setAddLoanOpen] = useState(false);

  const adminNavItems = [
    { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Customers', to: '/admin/customers', icon: Users },
    { label: 'Loans', to: '/admin/loans', icon: FileCheck2 },
    { label: 'EMI Management', to: '/admin/emi-management', icon: CalendarClock },
    { label: 'Payments', to: '/admin/payments', icon: Receipt },
    { label: 'Reports', to: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F3F5F6] flex text-[#172B3A]">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0D2740]/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Burgundy Sidebar Navigation (#612536) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#612536] text-white flex flex-col transition-transform duration-200 lg:translate-x-0 ${
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
                      ? 'bg-[#4C1C2B] text-white shadow-xs border border-white/10 font-bold'
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
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#4C1C2B]/60">
          <div className="text-[11px] text-white/60 font-semibold uppercase tracking-wider px-1">
            Demo Switcher
          </div>
          <button
            onClick={() => {
              quickSwitchUser('priya');
              navigate('/dashboard');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#E8EA68]" />
            Switch to Customer View
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-white/70 hover:text-[#C9414D] hover:bg-white/5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Admin Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DFE5E9] h-20 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-[#172B3A] hover:bg-gray-100 rounded-lg cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#172B3A]">
                Admin Dashboard
              </h2>
              <p className="text-xs text-[#7B8994] hidden sm:block">
                Welcome back, Admin! Here's what's happening today.
              </p>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-3">
            {/* Quick Add Loan Button */}
            <button
              onClick={() => setAddLoanOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#612536] hover:bg-[#4C1C2B] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Loan</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="w-10 h-10 rounded-xl border border-[#DFE5E9] flex items-center justify-center text-[#172B3A] hover:bg-gray-50 transition-colors cursor-pointer"
                aria-label="Admin notifications"
              >
                <Bell className="w-4 h-4 text-[#153755]" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#218568] rounded-full ring-2 ring-white" />
              </button>
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-[#DFE5E9]">
              <div className="w-8 h-8 rounded-lg bg-[#612536] text-white font-bold flex items-center justify-center text-xs">
                A
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-[#172B3A] leading-tight">Admin</p>
                <p className="text-[10px] text-[#7B8994] leading-tight">Administrator</p>
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
          window.location.reload();
        }}
      />
    </div>
  );
};
