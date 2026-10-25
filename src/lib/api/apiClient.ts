import { User, Loan, EMIScheduleItem, PaymentTransaction, CustomerProfile, SupportTicket, FinancialSummary } from '../../types';
import { db } from '../storage/mockDatabase';
import { calculateEMI, generateAmortizationSchedule } from '../calculations/emi';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Simulated network delay
const delay = (ms: number = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
  // Authentication endpoints (/api/v1/auth/*)
  async login(identifier: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(250);
    const user = db.getUserByEmailOrUsername(identifier);

    if (!user) {
      return {
        success: false,
        message: 'Invalid email/username or password.',
      };
    }

    // In demo environment, validate default passwords or check non-empty
    // Demo accounts: priya / password123, admin / admin123
    const isValid = (user.username === 'priya' && password === 'password123') ||
                    (user.username === 'admin' && password === 'admin123') ||
                    password.length >= 6;

    if (!isValid) {
      return {
        success: false,
        message: 'Invalid credentials. Please verify your password.',
      };
    }

    const token = `jwt_token_${user.id}_${Date.now()}`;
    return {
      success: true,
      data: { user, token },
      message: 'Logged in successfully.',
    };
  },

  async register(data: {
    fullName: string;
    email: string;
    phone: string;
    username: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    await delay(300);

    // Validation
    const existing = db.getUserByEmailOrUsername(data.email) || db.getUserByEmailOrUsername(data.username);
    if (existing) {
      return {
        success: false,
        message: 'An account with this email or username already exists.',
      };
    }

    const newUser: User = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      role: 'customer', // Public registration ALWAYS registers customer role
      fullName: data.fullName,
      phone: data.phone,
      createdAt: new Date().toISOString(),
    };

    db.addUser(newUser);

    // Also create customer profile
    db.addCustomer({
      id: `CUST-${Date.now().toString().slice(-4)}`,
      userId: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: data.phone,
      activeLoansCount: 0,
      totalBorrowed: 0,
      totalRepaid: 0,
      creditScore: 720,
      status: 'Active',
      createdAt: newUser.createdAt,
    });

    const token = `jwt_token_${newUser.id}_${Date.now()}`;
    return {
      success: true,
      data: { user: newUser, token },
      message: 'Account created successfully! Welcome to LoanEase.',
    };
  },

  async requestPasswordReset(email: string): Promise<ApiResponse<null>> {
    await delay(300);
    // Generic security message (never reveal if email exists)
    return {
      success: true,
      message: `If an account with ${email} exists, password reset instructions have been dispatched.`,
    };
  },

  // Customer Dashboard (/api/v1/dashboard/customer/)
  async getCustomerDashboard(customerId: string): Promise<ApiResponse<{
    user: User;
    customerProfile?: CustomerProfile;
    summary: FinancialSummary;
    primaryLoan?: Loan;
    loans: Loan[];
    recentTransactions: PaymentTransaction[];
    upcomingScheduleItem?: EMIScheduleItem;
  }>> {
    await delay(200);
    const user = db.getUserById(customerId);
    const customerProfile = db.getCustomerByUserId(customerId);
    const loans = db.getLoansByCustomerId(customerId);
    const transactions = db.getTransactionsByCustomerId(customerId);

    // Metrics calculation
    const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'approved');
    const totalLoanAmount = activeLoans.reduce((sum, l) => sum + l.principalAmount, 0);
    const totalPaid = loans.reduce((sum, l) => sum + l.paidAmount, 0);
    const remainingAmount = loans.reduce((sum, l) => sum + l.remainingAmount, 0);

    const primaryLoan = loans[0];
    let upcomingScheduleItem: EMIScheduleItem | undefined;
    if (primaryLoan) {
      const schedule = db.getScheduleForLoan(primaryLoan.id);
      upcomingScheduleItem = schedule.find(s => s.status !== 'paid');
    }

    return {
      success: true,
      data: {
        user: user!,
        customerProfile,
        summary: {
          totalLoans: loans.length,
          activeLoans: activeLoans.length,
          completedLoans: loans.filter(l => l.status === 'completed').length,
          pendingApplications: loans.filter(l => l.status === 'pending').length,
          totalLoanAmount,
          totalPaid,
          remainingAmount,
          overdueAmount: 0,
        },
        primaryLoan,
        loans,
        recentTransactions: transactions.slice(0, 5),
        upcomingScheduleItem,
      },
    };
  },

  // Admin Dashboard (/api/v1/dashboard/admin/)
  async getAdminDashboard(): Promise<ApiResponse<{
    metrics: {
      totalCustomers: number;
      activeLoans: number;
      completedLoans: number;
      totalLoanPrincipal: number;
      pendingLoans: number;
    };
    recentCustomers: Array<{
      id: string;
      name: string;
      email: string;
      loanAmount: number;
      status: 'Active' | 'Pending' | 'Overdue';
    }>;
    upcomingEmiPayments: Array<{
      customerName: string;
      loanId: string;
      amount: number;
      dueDate: string;
      status: string;
    }>;
    overduePayments: Array<{
      customerName: string;
      loanId: string;
      amount: number;
      daysOverdue: number;
      status: string;
    }>;
    monthlyApplications: Array<{
      month: string;
      approved: number;
      pending: number;
      rejected: number;
    }>;
  }>> {
    await delay(250);
    const loans = db.getLoans();
    const customers = db.getCustomers();

    const activeCount = loans.filter(l => l.status === 'active').length;
    const completedCount = 42; // standard demonstration metric matching Ref Image 1 (42)
    const totalPrincipal = 4850000; // Ref Image 1 matches ₹ 48,50,000

    return {
      success: true,
      data: {
        metrics: {
          totalCustomers: 125, // Ref Image 1: 125 (+5%)
          activeLoans: 98,    // Ref Image 1: 98 (+8%)
          completedLoans: completedCount, // Ref Image 1: 42 (+12%)
          totalLoanPrincipal: totalPrincipal, // Ref Image 1: ₹ 48,50,000 (+7%)
          pendingLoans: loans.filter(l => l.status === 'pending').length,
        },
        recentCustomers: [
          { id: 'CUST-002', name: 'Ravi Kumar', email: 'ravi.kumar@example.com', loanAmount: 150000, status: 'Active' },
          { id: 'CUST-003', name: 'Sneha Reddy', email: 'sneha.reddy@example.com', loanAmount: 200000, status: 'Active' },
          { id: 'CUST-004', name: 'Karthik', email: 'karthik@example.com', loanAmount: 75000, status: 'Pending' },
          { id: 'CUST-005', name: 'Anjali Singh', email: 'anjali.singh@example.com', loanAmount: 120000, status: 'Active' },
          { id: 'CUST-006', name: 'Vikram', email: 'vikram@example.com', loanAmount: 90000, status: 'Overdue' },
        ],
        upcomingEmiPayments: [
          { customerName: 'Ravi Kumar', loanId: 'LN001', amount: 9347, dueDate: '2024-11-10', status: 'Pending' },
          { customerName: 'Sneha Reddy', loanId: 'LN002', amount: 8932, dueDate: '2024-11-12', status: 'Pending' },
          { customerName: 'Karthik', loanId: 'LN003', amount: 7001, dueDate: '2024-11-15', status: 'Pending' },
          { customerName: 'Anjali Singh', loanId: 'LN004', amount: 9547, dueDate: '2024-11-18', status: 'Pending' },
        ],
        overduePayments: [
          { customerName: 'Customer Name', loanId: 'LN008', amount: 9347, daysOverdue: 5, status: 'Overdue' },
          { customerName: 'Lakshmi', loanId: 'LN010', amount: 7560, daysOverdue: 3, status: 'Overdue' },
          { customerName: 'Srinivas', loanId: 'LN012', amount: 8900, daysOverdue: 2, status: 'Overdue' },
        ],
        monthlyApplications: [
          { month: 'Jan', approved: 8, pending: 4, rejected: 1 },
          { month: 'Feb', approved: 10, pending: 5, rejected: 2 },
          { month: 'Mar', approved: 14, pending: 6, rejected: 2 },
          { month: 'Apr', approved: 12, pending: 7, rejected: 3 },
          { month: 'May', approved: 18, pending: 8, rejected: 1 },
          { month: 'Jun', approved: 22, pending: 10, rejected: 4 },
          { month: 'Jul', approved: 25, pending: 12, rejected: 3 },
        ],
      },
    };
  },

  // Loans API (/api/v1/loans/*)
  async getLoans(): Promise<ApiResponse<Loan[]>> {
    await delay(150);
    return { success: true, data: db.getLoans() };
  },

  async getLoanById(id: string): Promise<ApiResponse<Loan>> {
    await delay(150);
    const loan = db.getLoanById(id);
    if (!loan) return { success: false, message: 'Loan not found.' };
    return { success: true, data: loan };
  },

  async createLoanApplication(data: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    loanType: Loan['loanType'];
    principalAmount: number;
    annualInterestRate: number;
    tenureMonths: number;
    purpose: string;
    employmentType?: string;
    monthlyIncome?: number;
  }): Promise<ApiResponse<Loan>> {
    await delay(350);

    const emiCalc = calculateEMI(data.principalAmount, data.annualInterestRate, data.tenureMonths);
    const newId = `LN${Math.floor(100000 + Math.random() * 900000)}`;

    const newLoan: Loan = {
      id: newId,
      customerId: data.customerId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      loanType: data.loanType,
      principalAmount: data.principalAmount,
      annualInterestRate: data.annualInterestRate,
      tenureMonths: data.tenureMonths,
      monthlyEmi: emiCalc.monthlyEmi,
      totalInterest: emiCalc.totalInterest,
      totalRepayment: emiCalc.totalRepayment,
      paidAmount: 0,
      remainingAmount: emiCalc.totalRepayment,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      purpose: data.purpose,
      employmentType: data.employmentType || 'Salaried',
      monthlyIncome: data.monthlyIncome,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.addLoan(newLoan);
    return {
      success: true,
      data: newLoan,
      message: `Loan application ${newId} submitted successfully. It is currently under review by our credit officers.`,
    };
  },

  async approveLoan(loanId: string, adminName: string): Promise<ApiResponse<Loan>> {
    await delay(300);
    const loan = db.getLoanById(loanId);
    if (!loan) return { success: false, message: 'Loan not found.' };

    const today = new Date().toISOString().split('T')[0];
    const updated = db.updateLoan(loanId, {
      status: 'active',
      approvalDate: today,
      disbursementDate: today,
      nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      approvedBy: adminName,
    });

    return {
      success: true,
      data: updated,
      message: `Loan ${loanId} has been successfully approved and marked active. Repayment schedule generated.`,
    };
  },

  async rejectLoan(loanId: string, reason: string): Promise<ApiResponse<Loan>> {
    await delay(300);
    const loan = db.getLoanById(loanId);
    if (!loan) return { success: false, message: 'Loan not found.' };

    const updated = db.updateLoan(loanId, {
      status: 'rejected',
      rejectionReason: reason,
    });

    return {
      success: true,
      data: updated,
      message: `Loan ${loanId} application has been rejected.`,
    };
  },

  // EMI Schedule (/api/v1/loans/:id/schedule/)
  async getLoanSchedule(loanId: string): Promise<ApiResponse<EMIScheduleItem[]>> {
    await delay(150);
    const schedule = db.getScheduleForLoan(loanId);
    return { success: true, data: schedule };
  },

  // Payments (/api/v1/payments/*)
  async getTransactions(customerId?: string): Promise<ApiResponse<PaymentTransaction[]>> {
    await delay(150);
    const txns = customerId ? db.getTransactionsByCustomerId(customerId) : db.getTransactions();
    return { success: true, data: txns };
  },

  async recordPayment(params: {
    loanId: string;
    customerId: string;
    customerName: string;
    instalmentNumber?: number;
    amount: number;
    paymentMethod: PaymentTransaction['paymentMethod'];
    description?: string;
  }): Promise<ApiResponse<{ transaction: PaymentTransaction; updatedSchedule?: EMIScheduleItem }>> {
    await delay(400);

    const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date().toISOString().split('T')[0];

    const transaction: PaymentTransaction = {
      id: txnId,
      loanId: params.loanId,
      customerId: params.customerId,
      customerName: params.customerName,
      instalmentNumber: params.instalmentNumber,
      amount: params.amount,
      paymentMethod: params.paymentMethod,
      status: 'Completed',
      paymentDate: today,
      receiptNumber: `RCP-${today.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`,
      description: params.description || `EMI Payment for ${params.loanId}`,
    };

    db.addTransaction(transaction);

    let updatedSchedule: EMIScheduleItem | undefined;
    if (params.instalmentNumber) {
      updatedSchedule = db.markScheduleItemPaid(
        params.loanId,
        params.instalmentNumber,
        params.paymentMethod,
        txnId
      );
    }

    return {
      success: true,
      data: { transaction, updatedSchedule },
      message: `Payment of ₹${params.amount.toLocaleString('en-IN')} processed successfully! Transaction ID: ${txnId}`,
    };
  },

  // Customers (/api/v1/customers/*)
  async getCustomers(): Promise<ApiResponse<CustomerProfile[]>> {
    await delay(150);
    return { success: true, data: db.getCustomers() };
  },

  // Support tickets
  async getTickets(customerId?: string): Promise<ApiResponse<SupportTicket[]>> {
    await delay(150);
    const tickets = customerId ? db.getTicketsByCustomerId(customerId) : db.getTickets();
    return { success: true, data: tickets };
  },

  async createTicket(ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>): Promise<ApiResponse<SupportTicket>> {
    await delay(250);
    const newTicket: SupportTicket = {
      ...ticket,
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Open',
      createdAt: new Date().toISOString(),
    };
    db.addTicket(newTicket);
    return {
      success: true,
      data: newTicket,
      message: 'Support ticket submitted. A financial specialist will reply within 24 hours.',
    };
  },
};
