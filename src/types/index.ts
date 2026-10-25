export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type LoanStatus = 'pending' | 'approved' | 'active' | 'completed' | 'rejected';
export type LoanType = 'Personal' | 'Home' | 'Vehicle' | 'Education' | 'Business';

export interface Loan {
  id: string; // e.g., 'LN123456'
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  loanType: LoanType;
  principalAmount: number;
  annualInterestRate: number; // e.g. 12 for 12%
  tenureMonths: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
  paidAmount: number;
  remainingAmount: number;
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  nextDueDate?: string;
  status: LoanStatus;
  purpose?: string;
  employmentType?: string;
  monthlyIncome?: number;
  rejectionReason?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'failed';

export interface EMIScheduleItem {
  id: string;
  loanId: string;
  instalmentNumber: number;
  dueDate: string;
  principalComponent: number;
  interestComponent: number;
  monthlyEmi: number;
  paidAmount: number;
  remainingPrincipal: number;
  status: PaymentStatus;
  paidDate?: string;
  transactionRef?: string;
  paymentMethod?: string;
}

export type PaymentMethod = 'UPI' | 'Net Banking' | 'Debit Card' | 'Credit Card' | 'Bank Transfer';

export interface PaymentTransaction {
  id: string; // e.g. 'TXN-90214'
  loanId: string;
  customerId: string;
  customerName: string;
  instalmentNumber?: number;
  amount: number;
  paymentMethod: PaymentMethod;
  status: 'Completed' | 'Pending' | 'Failed';
  paymentDate: string;
  receiptNumber: string;
  description: string;
}

export interface CustomerProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  panNumber?: string;
  occupation?: string;
  activeLoansCount: number;
  totalBorrowed: number;
  totalRepaid: number;
  creditScore: number;
  status: 'Active' | 'Pending' | 'Suspended';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  subject: string;
  category: 'Loan Query' | 'Payment Issue' | 'EMI Calculation' | 'General';
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface FinancialSummary {
  totalLoans: number;
  activeLoans: number;
  completedLoans: number;
  pendingApplications: number;
  totalLoanAmount: number;
  totalPaid: number;
  remainingAmount: number;
  overdueAmount: number;
}
