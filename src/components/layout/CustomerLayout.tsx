import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  CalendarDays,
  Clock,
  User as UserIcon,
  HelpCircle,
  LogOut,
  Bell,
  Menu,
  X,
  PlusCircle,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { db } from '../../lib/storage/mockDatabase';
import { useNotification } from '../../context/NotificationContext';
import { ApiDocsModal } from '../modals/ApiDocsModal';

export const CustomerLayout: React.FC = () => {
  const { user, logout, quickSwitchUser } = useAuth();
  const { success } = useNotification();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [apiDocsOpen, setApiDocsOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'My Loans', to: '/loans', icon: FileText },
    { label: 'Apply for Loan', to: '/loans/apply', icon: PlusCircle },
    { label: 'EMI Schedule', to: '/emi-schedule', icon: CalendarDays },
    { label: 'EMI Payments', to: '/payments', icon: CreditCard },
    { label: 'Payment History', to: '/payments/history', icon: Clock },
    { label: 'Profile', to: '/profile', icon: UserIcon },
    { label: 'Support', to: '/support', icon: HelpCircle },
  ];

  const handleResetData = () => {
    db.resetAll();
    success('Data Reset', 'Demonstration dataset restored to factory defaults.');
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

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#12365A] text-white flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Logo variant="light" size="sm" portalSubtitle="Customer Portal" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard'}
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

        {/* Quick Demo Switcher & Reset in Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#0B2442]/50">
          <div className="text-[11px] text-white/60 font-semibold uppercase tracking-wider px-1">
            Demo Controls
          </div>
          <button
            onClick={() => {
              quickSwitchUser('admin');
              navigate('/admin/dashboard');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[#E7A23B]" />
            Switch to Admin Panel
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

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header */}
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
              <h2 className="text-xl sm:text-2xl font-bold text-[#172B4D] flex items-center gap-2">
                Hello, {user?.fullName?.split(' ')[0] || 'Priya'}
                <span className="text-xl">☀️</span>
              </h2>
              <p className="text-xs text-[#687B94] hidden sm:block">
                Here's an overview of your loan and payment details.
              </p>
            </div>
          </div>

          {/* Right Header Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setApiDocsOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5145CD] bg-[#5145CD]/10 hover:bg-[#5145CD]/20 rounded-lg transition-colors"
              title="Open OpenAPI Swagger Documentation"
            >
              <span>Swagger API</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="w-10 h-10 rounded-xl border border-[#DFE7F0] flex items-center justify-center text-[#172B4D] hover:bg-gray-50 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-[#12365A]" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#DC5263] rounded-full ring-2 ring-white" />
              </button>
            </div>

            {/* User Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-[#DFE7F0] hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#5145CD]/10 text-[#5145CD] font-bold flex items-center justify-center overflow-hidden text-xs">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.fullName?.charAt(0) || 'P'
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-[#172B4D] leading-tight">
                    {user?.fullName || 'Priya Sharma'}
                  </p>
                  <p className="text-[10px] text-[#687B94] leading-tight capitalize">
                    {user?.role || 'Customer'}
                  </p>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#DFE7F0] py-1 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                  <NavLink
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-[#172B4D] hover:bg-gray-50 font-medium"
                  >
                    My Profile
                  </NavLink>
                  <NavLink
                    to="/support"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-[#172B4D] hover:bg-gray-50 font-medium"
                  >
                    Help & Support
                  </NavLink>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleResetData();
                    }}
                    className="w-full text-left px-4 py-2 text-[#E7A23B] hover:bg-gray-50 font-medium flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Demo Data
                  </button>
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-[#DC5263] hover:bg-red-50 font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      <ApiDocsModal isOpen={apiDocsOpen} onClose={() => setApiDocsOpen(false)} />
    </div>
  );
};
