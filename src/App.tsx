import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts & Guards
import { CustomerLayout } from './components/layout/CustomerLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Customer Pages
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { MyLoansPage } from './pages/customer/MyLoansPage';
import { ApplyLoanPage } from './pages/customer/ApplyLoanPage';
import { LoanDetailPage } from './pages/customer/LoanDetailPage';
import { EmiSchedulePage } from './pages/customer/EmiSchedulePage';
import { EmiPaymentsPage } from './pages/customer/EmiPaymentsPage';
import { PaymentHistoryPage } from './pages/customer/PaymentHistoryPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { SupportPage } from './pages/customer/SupportPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminLoansPage } from './pages/admin/AdminLoansPage';
import { AdminLoanDetailPage } from './pages/admin/AdminLoanDetailPage';
import { AdminEmiManagementPage } from './pages/admin/AdminEmiManagementPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />

            {/* Authenticated Customer Routes */}
            <Route
              element={
                <ProtectedRoute requiredRole="customer">
                  <CustomerLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/loans" element={<MyLoansPage />} />
              <Route path="/loans/apply" element={<ApplyLoanPage />} />
              <Route path="/loans/:loanId" element={<LoanDetailPage />} />
              <Route path="/emi-schedule" element={<EmiSchedulePage />} />
              <Route path="/payments" element={<EmiPaymentsPage />} />
              <Route path="/payments/history" element={<PaymentHistoryPage />} />
              <Route path="/payments/:paymentId" element={<PaymentHistoryPage />} />
              <Route path="/profile" element={<CustomerProfilePage />} />
              <Route path="/support" element={<SupportPage />} />
            </Route>

            {/* Authenticated Administrator Routes */}
            <Route
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/customers" element={<AdminCustomersPage />} />
              <Route path="/admin/customers/:customerId" element={<AdminCustomersPage />} />
              <Route path="/admin/loans" element={<AdminLoansPage />} />
              <Route path="/admin/loans/:loanId" element={<AdminLoanDetailPage />} />
              <Route path="/admin/loan-applications" element={<AdminLoansPage />} />
              <Route path="/admin/emi-management" element={<AdminEmiManagementPage />} />
              <Route path="/admin/payments" element={<AdminPaymentsPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
            </Route>

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}
