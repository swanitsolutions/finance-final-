import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/storage/mockDatabase';
import { useNotification } from '../../context/NotificationContext';
import { formatDate } from '../../lib/formatters/currency';
import { User, Mail, Phone, MapPin, ShieldCheck, Lock, Award, Clock } from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useNotification();

  const customerProfile = user ? db.getCustomerByUserId(user.id) : null;

  const [fullName, setFullName] = useState(user?.fullName || 'Priya Sharma');
  const [email, setEmail] = useState(user?.email || 'priya@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [address, setAddress] = useState(
    customerProfile?.address || 'Flat 402, Green Valley Apts, Indiranagar, Bengaluru, KA - 560038'
  );

  // Change password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdatingProfile(true);

    db.updateUser(user.id, { fullName, email, phone });
    if (customerProfile) {
      db.updateCustomer(customerProfile.id, { fullName, email, phone, address });
    }

    setTimeout(() => {
      setIsUpdatingProfile(false);
      success('Profile Updated', 'Your contact preferences have been saved.');
    }, 300);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      error('Weak Password', 'New password must have at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('Mismatch', 'New passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      success('Security Updated', 'Your password has been securely updated.');
    }, 350);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#172B4D]">My Profile & Account</h2>
        <p className="text-xs text-[#687B94] mt-0.5">
          Manage your verified contact details and authentication credentials.
        </p>
      </div>

      {/* Credit Standing & KYC Status Banner */}
      <div className="bg-gradient-to-r from-[#12365A] to-[#0B2442] text-white rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-xl text-white">
            {user?.fullName?.charAt(0) || 'P'}
          </div>
          <div>
            <h3 className="text-base font-bold">{user?.fullName || 'Priya Sharma'}</h3>
            <p className="text-xs text-white/70">Verified Customer</p>
            <p className="text-[11px] text-white/50 mt-1">
              Member since {formatDate(user?.createdAt || '2024-01-15')}
            </p>
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
          <span className="text-[11px] text-white/60 uppercase font-semibold">Credit Standing</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-extrabold text-[#159A78] tabular-nums">785</span>
            <span className="text-xs bg-[#159A78]/20 text-[#159A78] px-2 py-0.5 rounded-full font-semibold">
              Excellent
            </span>
          </div>
          <p className="text-[10px] text-white/60 mt-1">Prime credit eligible for lowest rates</p>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
          <span className="text-[11px] text-white/60 uppercase font-semibold">PAN & KYC Verification</span>
          <p className="text-sm font-mono font-bold text-white mt-1">ABCDE••••F</p>
          <span className="inline-flex items-center gap-1 text-[11px] text-[#159A78] font-semibold mt-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Fully Compliant
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal & Contact Details */}
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <User className="w-4 h-4 text-[#5145CD]" />
            <h3 className="text-sm font-bold text-[#172B4D]">Contact Information</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#172B4D] mb-1">Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#172B4D] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#172B4D] mb-1">Primary Mobile</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#172B4D] mb-1">Residential Address</label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full py-2.5 bg-[#5145CD] hover:bg-[#4036B5] text-white font-semibold rounded-xl transition-colors shadow-xs"
            >
              {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-[#DFE7F0] p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <Lock className="w-4 h-4 text-[#5145CD]" />
            <h3 className="text-sm font-bold text-[#172B4D]">Security & Password</h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#172B4D] mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#172B4D] mb-1">New Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#172B4D] mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-type new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFE7F0] focus:outline-none focus:ring-2 focus:ring-[#5145CD]/30"
              />
            </div>

            <div className="p-3 bg-[#F4F8FC] rounded-xl text-[11px] text-[#687B94]">
              Password must contain at least 6 characters. Sessions on other devices will be preserved.
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full py-2.5 bg-[#12365A] hover:bg-[#0B2442] text-white font-semibold rounded-xl transition-colors shadow-xs"
            >
              {isUpdatingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
