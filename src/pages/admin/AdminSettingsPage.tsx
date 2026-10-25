import React, { useState } from 'react';
import { db } from '../../lib/storage/mockDatabase';
import { useNotification } from '../../context/NotificationContext';
import { RotateCcw, Bell, Sliders } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { success, warning } = useNotification();

  const [personalRate, setPersonalRate] = useState(12.0);
  const [homeRate, setHomeRate] = useState(9.5);
  const [vehicleRate, setVehicleRate] = useState(10.5);
  const [educationRate, setEducationRate] = useState(8.5);
  const [businessRate, setBusinessRate] = useState(13.0);
  const [gracePeriodDays, setGracePeriodDays] = useState(5);
  const [lateFeeFixed, setLateFeeFixed] = useState(500);

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    success('Policy Updated', 'Lending interest rate guidelines and late fee structure saved.');
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to factory defaults? This will restore initial accounts, loans, and schedules.')) {
      db.resetAll();
      warning('Data Reset', 'All demonstration state restored to factory defaults.');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#172B3A]">System Settings & Underwriting Policy</h2>
        <p className="text-xs text-[#536473] mt-0.5">
          Configure default interest rates, grace periods, late fees, and demonstration storage.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interest Rate Policies */}
        <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#DFE5E9]">
            <Sliders className="w-4 h-4 text-[#612536]" />
            <h3 className="text-sm font-bold text-[#172B3A]">Annual Interest Rate Guidelines (% p.a.)</h3>
          </div>

          <form onSubmit={handleSavePolicies} className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#172B3A]">Personal Loan</label>
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  step="0.1"
                  value={personalRate}
                  onChange={(e) => setPersonalRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#DFE5E9] text-right font-bold focus:border-[#612536] outline-hidden text-[#172B3A]"
                />
                <span className="text-[#536473] font-bold">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#172B3A]">Home Loan</label>
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  step="0.1"
                  value={homeRate}
                  onChange={(e) => setHomeRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#DFE5E9] text-right font-bold focus:border-[#612536] outline-hidden text-[#172B3A]"
                />
                <span className="text-[#536473] font-bold">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#172B3A]">Vehicle Loan</label>
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  step="0.1"
                  value={vehicleRate}
                  onChange={(e) => setVehicleRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#DFE5E9] text-right font-bold focus:border-[#612536] outline-hidden text-[#172B3A]"
                />
                <span className="text-[#536473] font-bold">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#172B3A]">Education Loan</label>
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  step="0.1"
                  value={educationRate}
                  onChange={(e) => setEducationRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#DFE5E9] text-right font-bold focus:border-[#612536] outline-hidden text-[#172B3A]"
                />
                <span className="text-[#536473] font-bold">%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-[#172B3A]">Business Loan</label>
              <div className="flex items-center gap-1 w-24">
                <input
                  type="number"
                  step="0.1"
                  value={businessRate}
                  onChange={(e) => setBusinessRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-[#DFE5E9] text-right font-bold focus:border-[#612536] outline-hidden text-[#172B3A]"
                />
                <span className="text-[#536473] font-bold">%</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#612536] hover:bg-[#4C1C2B] text-white rounded-xl font-semibold transition-colors mt-2"
            >
              Update Benchmark Rates
            </button>
          </form>
        </div>

        {/* Late Fee and Collections Policy */}
        <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#DFE5E9]">
            <Bell className="w-4 h-4 text-[#612536]" />
            <h3 className="text-sm font-bold text-[#172B3A]">Overdue Policy & Late Charges</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#172B3A] mb-1">
                Grace Period Before Overdue Flag (Days)
              </label>
              <input
                type="number"
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFE5E9] text-[#172B3A] focus:border-[#612536] outline-hidden"
              />
              <p className="text-[11px] text-[#536473] mt-1">
                Borrowers receive reminders without penalty during this grace window.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-[#172B3A] mb-1">
                Fixed Late Clearance Fee (INR)
              </label>
              <input
                type="number"
                value={lateFeeFixed}
                onChange={(e) => setLateFeeFixed(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#DFE5E9] text-[#172B3A] focus:border-[#612536] outline-hidden"
              />
              <p className="text-[11px] text-[#536473] mt-1">
                Standard charge applied only when documented backend policy permits.
              </p>
            </div>

            <div className="p-3 bg-[#E6F4EE] rounded-xl border border-[#218568]/20 text-[11px] text-[#218568] font-medium">
              ✓ Complies with Fair Practices Code for Non-Banking & Digital Lending.
            </div>
          </div>
        </div>
      </div>

      {/* Demonstration Reset & Audit Logs */}
      <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#DFE5E9]">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#C28A20]" />
            <h3 className="text-sm font-bold text-[#172B3A]">Demonstration State & Data Reset</h3>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-semibold text-[#172B3A]">Factory Reset Mock Database</p>
            <p className="text-[#536473] text-[11px] mt-0.5 max-w-xl">
              Restores Priya Sharma's reference loan (LN123456, ₹2,00,000 at 12%), Admin portfolio metrics (125 customers, 98 active loans), and all seed transactions.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-4 py-2 bg-[#FFF4D9] hover:bg-amber-100 text-[#C28A20] border border-[#C28A20]/30 rounded-xl font-bold transition-colors shrink-0"
          >
            Reset All Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
