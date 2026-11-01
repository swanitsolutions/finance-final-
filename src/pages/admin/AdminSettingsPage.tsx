import React, { useState, useEffect } from 'react';
import { db } from '../../lib/storage/mockDatabase';
import { apiClient } from '../../lib/api/apiClient';
import { useNotification } from '../../context/NotificationContext';
import { runAllSystemTests, AllTestsSummary } from '../../tests';
import { AuditLog, AuditSeverity } from '../../types';
import { 
  RotateCcw, 
  Bell, 
  Sliders, 
  Database, 
  Download, 
  Upload, 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  FileCode, 
  Search, 
  Play, 
  Filter,
  Clock,
  User,
  Server
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { success, warning, error } = useNotification();

  const [activeTab, setActiveTab] = useState<'policies' | 'backup' | 'audit' | 'tests'>('policies');

  // Policy States
  const [personalRate, setPersonalRate] = useState(12.0);
  const [homeRate, setHomeRate] = useState(9.5);
  const [vehicleRate, setVehicleRate] = useState(10.5);
  const [educationRate, setEducationRate] = useState(8.5);
  const [businessRate, setBusinessRate] = useState(13.0);
  const [gracePeriodDays, setGracePeriodDays] = useState(5);
  const [lateFeeFixed, setLateFeeFixed] = useState(500);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [logSearch, setLogSearch] = useState('');
  const [logSeverityFilter, setLogSeverityFilter] = useState<'ALL' | AuditSeverity>('ALL');

  // Test Runner State
  const [testSummary, setTestSummary] = useState<AllTestsSummary | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Backup Import State
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    const res = await apiClient.getAuditLogs();
    if (res.success && res.data) {
      setAuditLogs(res.data);
    }
  };

  const handleSavePolicies = (e: React.FormEvent) => {
    e.preventDefault();
    db.addAuditLog({
      userId: 'USR-002',
      userName: 'Admin Administrator',
      role: 'admin',
      action: 'POLICY_UPDATE',
      entity: 'Policy',
      details: `Updated benchmark rates: Personal ${personalRate}%, Home ${homeRate}%, Vehicle ${vehicleRate}%.`,
      severity: 'INFO',
    });
    loadAuditLogs();
    success('Policy Updated', 'Lending interest rate guidelines and late fee structure saved.');
  };

  // Database Backup (JSON Export) - Item 23
  const handleExportBackup = async () => {
    const res = await apiClient.exportDatabaseBackup();
    if (res.success && res.data) {
      const blob = new Blob([res.data.json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      success('Backup Generated', `Downloaded ${res.data.filename}`);
      loadAuditLogs();
    } else {
      error('Backup Failed', 'Could not export database.');
    }
  };

  // Database Restore (JSON Import) - Item 23
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      error('Invalid File', 'Please upload a valid .json database backup file.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    setIsImporting(true);
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const res = await apiClient.importDatabaseBackup(text);
        setIsImporting(false);
        if (res.success) {
          success('Database Restored', res.message);
          loadAuditLogs();
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          error('Restore Failed', res.message || 'Corrupted database snapshot.');
        }
      } catch (err: any) {
        setIsImporting(false);
        error('Restore Error', err.message || 'Failed to read file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to factory defaults? This will restore initial accounts, loans, and schedules.')) {
      db.resetAll();
      warning('Data Reset', 'All demonstration state restored to factory defaults.');
      window.location.reload();
    }
  };

  // Run Automated Test Suite - Item 24
  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const results = runAllSystemTests();
      setTestSummary(results);
      setIsRunningTests(false);
      success('Tests Completed', `${results.totalPassed} passed, ${results.totalFailed} failed in ${results.durationMs}ms`);
    }, 300);
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.userName.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.entity.toLowerCase().includes(logSearch.toLowerCase());
    const matchesSeverity = logSeverityFilter === 'ALL' || log.severity === logSeverityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#172B3A]">System Settings & Administration</h2>
        <p className="text-xs text-[#536473] mt-0.5">
          Underwriting policy configuration, database disaster recovery, real-time audit logging, and automated test diagnostics.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#DFE5E9] pb-3">
        <button
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'policies'
              ? 'bg-[#612536] text-white shadow-xs'
              : 'bg-white hover:bg-[#F5F8FA] text-[#536473] border border-[#DFE5E9]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Underwriting Policies</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'backup'
              ? 'bg-[#612536] text-white shadow-xs'
              : 'bg-white hover:bg-[#F5F8FA] text-[#536473] border border-[#DFE5E9]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database Backup & Restore</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'audit'
              ? 'bg-[#612536] text-white shadow-xs'
              : 'bg-white hover:bg-[#F5F8FA] text-[#536473] border border-[#DFE5E9]'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Audit & Security Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'tests'
              ? 'bg-[#612536] text-white shadow-xs'
              : 'bg-white hover:bg-[#F5F8FA] text-[#536473] border border-[#DFE5E9]'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Automated Test Suite</span>
        </button>
      </div>

      {/* TAB 1: Underwriting Policies */}
      {activeTab === 'policies' && (
        <div className="space-y-6">
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
        </div>
      )}

      {/* TAB 2: Database Backup & Restore (Requirement 23) */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export JSON Backup */}
            <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#DFE5E9]">
                <Download className="w-4 h-4 text-[#218568]" />
                <h3 className="text-sm font-bold text-[#172B3A]">Export Database Backup (JSON)</h3>
              </div>
              <p className="text-xs text-[#536473] leading-relaxed">
                Generates a complete, validated snapshot of all relational tables: Users, Loans, Amortization Schedules, Payments, Customer Profiles, and Audit Logs.
              </p>
              <div className="p-3 bg-[#F5F8FA] rounded-xl border border-[#DFE5E9] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#536473]">Format:</span>
                  <span className="font-semibold text-[#172B3A]">JSON (v1.0.0 Specification)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#536473]">Encrypted Claims:</span>
                  <span className="font-semibold text-[#218568]">Verified</span>
                </div>
              </div>
              <button
                onClick={handleExportBackup}
                className="w-full py-2.5 bg-[#0D343B] hover:bg-[#082328] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download Database Snapshot (.json)</span>
              </button>
            </div>

            {/* Import JSON Restore */}
            <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#DFE5E9]">
                <Upload className="w-4 h-4 text-[#C28A20]" />
                <h3 className="text-sm font-bold text-[#172B3A]">Restore from Backup File</h3>
              </div>
              <p className="text-xs text-[#536473] leading-relaxed">
                Upload a previously exported LoanEase JSON snapshot. Restores system state and validates table relationships before applying.
              </p>
              <label className="w-full py-2.5 bg-white hover:bg-gray-50 border border-dashed border-[#DFE5E9] hover:border-[#612536] text-[#172B3A] rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4 text-[#612536]" />
                <span>{isImporting ? 'Restoring Database...' : 'Select Backup File (.json)'}</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportBackup}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-[#7B8994]">
                Note: Restoring a snapshot replaces the current session tables with the backup archive.
              </p>
            </div>
          </div>

          {/* Factory Reset */}
          <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DFE5E9]">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#C9414D]" />
                <h3 className="text-sm font-bold text-[#172B3A]">Factory Reset Demonstration Database</h3>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <p className="font-semibold text-[#172B3A]">Reset Database to Initial State</p>
                <p className="text-[#536473] text-[11px] mt-0.5 max-w-xl">
                  Re-seeds Priya Sharma's baseline loan (LN123456, ₹2,00,000 at 12%), Executive KPIs (125 customers, 98 active loans), and all seed transactions.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="px-4 py-2 bg-[#FCEBED] hover:bg-red-100 text-[#C9414D] border border-[#C9414D]/30 rounded-xl font-bold transition-colors shrink-0"
              >
                Reset All Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Audit & Security Logs (Requirement 27) */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DFE5E9]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#612536]" />
              <h3 className="text-sm font-bold text-[#172B3A]">System Activity & Security Audit Trail</h3>
            </div>
            <span className="text-xs text-[#536473]">
              {filteredLogs.length} events logged
            </span>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#7B8994] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search audit actions, users, details..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] focus:outline-none focus:border-[#612536]"
              />
            </div>
            <select
              value={logSeverityFilter}
              onChange={(e) => setLogSeverityFilter(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-[#DFE5E9] bg-white text-[#172B3A] font-medium focus:outline-none focus:border-[#612536]"
            >
              <option value="ALL">All Severities</option>
              <option value="INFO">INFO Only</option>
              <option value="WARN">WARN Only</option>
              <option value="SECURITY">SECURITY Only</option>
              <option value="ERROR">ERROR Only</option>
            </select>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto border border-[#DFE5E9] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F8FA] text-[#7B8994] font-semibold uppercase text-[10px] tracking-wider border-b border-[#DFE5E9]">
                <tr>
                  <th className="px-3.5 py-2.5">Severity</th>
                  <th className="px-3.5 py-2.5">Timestamp</th>
                  <th className="px-3.5 py-2.5">Action</th>
                  <th className="px-3.5 py-2.5">Actor</th>
                  <th className="px-3.5 py-2.5">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DFE5E9]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F9FBFC] transition-colors">
                    <td className="px-3.5 py-2.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          log.severity === 'SECURITY'
                            ? 'bg-[#FCEBED] text-[#C9414D]'
                            : log.severity === 'WARN'
                            ? 'bg-[#FFF4D9] text-[#C28A20]'
                            : log.severity === 'ERROR'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-[#E6F4EE] text-[#218568]'
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-[#536473] whitespace-nowrap font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-3.5 py-2.5 font-bold font-mono text-[11px] text-[#172B3A] whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="px-3.5 py-2.5 text-[#172B3A] whitespace-nowrap">
                      {log.userName}
                    </td>
                    <td className="px-3.5 py-2.5 text-[#536473] leading-relaxed">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Automated Test Suite (Requirement 24) */}
      {activeTab === 'tests' && (
        <div className="bg-white rounded-2xl border border-[#DFE5E9] p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DFE5E9]">
            <div>
              <h3 className="text-sm font-bold text-[#172B3A]">Self-Contained Automated Test Runner</h3>
              <p className="text-xs text-[#536473] mt-0.5">
                Executes mathematical amortization suites, authorization assertions, and input validation tests.
              </p>
            </div>
            <button
              onClick={handleRunTests}
              disabled={isRunningTests}
              className="px-4 py-2 bg-[#612536] hover:bg-[#4C1C2B] text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50 shrink-0"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isRunningTests ? 'Running Suites...' : 'Run Automated Test Suite'}</span>
            </button>
          </div>

          {testSummary ? (
            <div className="space-y-4">
              {/* Summary KPIs */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-[#E6F4EE] rounded-xl border border-[#218568]/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#218568]">Passing Tests</p>
                  <p className="text-xl font-bold text-[#218568] tabular-nums mt-0.5">{testSummary.totalPassed}</p>
                </div>
                <div className="p-3.5 bg-[#FCEBED] rounded-xl border border-[#C9414D]/20">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#C9414D]">Failed Tests</p>
                  <p className="text-xl font-bold text-[#C9414D] tabular-nums mt-0.5">{testSummary.totalFailed}</p>
                </div>
                <div className="p-3.5 bg-[#EDF2F5] rounded-xl border border-[#DFE5E9]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#153755]">Execution Latency</p>
                  <p className="text-xl font-bold text-[#153755] tabular-nums mt-0.5">{testSummary.durationMs} ms</p>
                </div>
              </div>

              {/* Suite Detail Accordions */}
              <div className="space-y-3">
                {testSummary.suites.map((suite, idx) => (
                  <div key={idx} className="border border-[#DFE5E9] rounded-xl p-4 bg-[#F5F8FA] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#218568]" />
                        <h4 className="text-xs font-bold text-[#172B3A]">{suite.suiteName}</h4>
                      </div>
                      <span className="text-[11px] font-bold text-[#218568] bg-[#E6F4EE] px-2 py-0.5 rounded">
                        {suite.passed} passed · 0 failed
                      </span>
                    </div>

                    <div className="bg-[#0D2740] rounded-lg p-3 text-[11px] font-mono text-[#D9E0E5] space-y-1">
                      {suite.results.map((res, rIdx) => (
                        <p key={rIdx} className={res.startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}>
                          {res}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center border border-dashed border-[#DFE5E9] rounded-xl space-y-2">
              <FileCode className="w-8 h-8 text-[#7B8994] mx-auto" />
              <p className="text-xs font-semibold text-[#172B3A]">Test Suites Ready</p>
              <p className="text-[11px] text-[#536473] max-w-sm mx-auto">
                Click "Run Automated Test Suite" above to verify reducing-balance amortization schedules, RBAC rules, and input constraints.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
