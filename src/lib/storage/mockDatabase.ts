import { User, Loan, EMIScheduleItem, PaymentTransaction, CustomerProfile, SupportTicket } from '../../types';
import { calculateEMI, generateAmortizationSchedule } from '../calculations/emi';

const STORAGE_KEY_PREFIX = 'loanease_v1_';

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-001',
    username: 'priya',
    email: 'priya@example.com',
    role: 'customer',
    fullName: 'Priya Sharma',
    phone: '+91 98765 43210',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 'USR-002',
    username: 'admin',
    email: 'admin@loanease.com',
    role: 'admin',
    fullName: 'Admin Administrator',
    phone: '+91 91234 56789',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2023-11-01T08:00:00.000Z',
  },
  {
    id: 'USR-003',
    username: 'ravi',
    email: 'ravi.kumar@example.com',
    role: 'customer',
    fullName: 'Ravi Kumar',
    phone: '+91 98450 12345',
    createdAt: '2024-02-10T11:00:00.000Z',
  },
  {
    id: 'USR-004',
    username: 'sneha',
    email: 'sneha.reddy@example.com',
    role: 'customer',
    fullName: 'Sneha Reddy',
    phone: '+91 97310 98765',
    createdAt: '2024-03-05T09:30:00.000Z',
  },
  {
    id: 'USR-005',
    username: 'karthik',
    email: 'karthik@example.com',
    role: 'customer',
    fullName: 'Karthik',
    phone: '+91 99123 44556',
    createdAt: '2024-05-12T14:20:00.000Z',
  },
  {
    id: 'USR-006',
    username: 'anjali',
    email: 'anjali.singh@example.com',
    role: 'customer',
    fullName: 'Anjali Singh',
    phone: '+91 98200 77889',
    createdAt: '2024-06-18T16:45:00.000Z',
  },
  {
    id: 'USR-007',
    username: 'vikram',
    email: 'vikram@example.com',
    role: 'customer',
    fullName: 'Vikram',
    phone: '+91 94480 33221',
    createdAt: '2024-07-22T10:15:00.000Z',
  },
];

// Reference customer loan for Priya
const priyaEmi = calculateEMI(200000, 12, 24);

export const INITIAL_LOANS: Loan[] = [
  {
    id: 'LN123456',
    customerId: 'USR-001',
    customerName: 'Priya Sharma',
    customerEmail: 'priya@example.com',
    customerPhone: '+91 98765 43210',
    loanType: 'Personal',
    principalAmount: 200000,
    annualInterestRate: 12,
    tenureMonths: 24,
    monthlyEmi: priyaEmi.monthlyEmi, // ₹ 9,347
    totalInterest: priyaEmi.totalInterest,
    totalRepayment: priyaEmi.totalRepayment,
    paidAmount: 60000,
    remainingAmount: 140000,
    applicationDate: '2024-08-01',
    approvalDate: '2024-08-04',
    disbursementDate: '2024-08-05',
    nextDueDate: '2024-11-10',
    status: 'active',
    purpose: 'Home renovation and interior upgrades',
    employmentType: 'Salaried',
    monthlyIncome: 75000,
    createdAt: '2024-08-01T09:00:00.000Z',
    updatedAt: '2024-10-10T14:30:00.000Z',
  },
  {
    id: 'LN001',
    customerId: 'USR-003',
    customerName: 'Ravi Kumar',
    customerEmail: 'ravi.kumar@example.com',
    customerPhone: '+91 98450 12345',
    loanType: 'Vehicle',
    principalAmount: 150000,
    annualInterestRate: 11.5,
    tenureMonths: 18,
    monthlyEmi: 9347,
    totalInterest: 18246,
    totalRepayment: 168246,
    paidAmount: 56082,
    remainingAmount: 112164,
    applicationDate: '2024-05-02',
    approvalDate: '2024-05-05',
    disbursementDate: '2024-05-10',
    nextDueDate: '2024-11-10',
    status: 'active',
    purpose: 'Two-wheeler purchase',
    createdAt: '2024-05-02T10:00:00.000Z',
    updatedAt: '2024-10-10T09:00:00.000Z',
  },
  {
    id: 'LN002',
    customerId: 'USR-004',
    customerName: 'Sneha Reddy',
    customerEmail: 'sneha.reddy@example.com',
    customerPhone: '+91 97310 98765',
    loanType: 'Personal',
    principalAmount: 200000,
    annualInterestRate: 12.5,
    tenureMonths: 28,
    monthlyEmi: 8932,
    totalInterest: 50096,
    totalRepayment: 250096,
    paidAmount: 44660,
    remainingAmount: 205436,
    applicationDate: '2024-06-10',
    approvalDate: '2024-06-12',
    disbursementDate: '2024-06-15',
    nextDueDate: '2024-11-12',
    status: 'active',
    purpose: 'Higher education course fee',
    createdAt: '2024-06-10T12:00:00.000Z',
    updatedAt: '2024-10-12T11:00:00.000Z',
  },
  {
    id: 'LN003',
    customerId: 'USR-005',
    customerName: 'Karthik',
    customerEmail: 'karthik@example.com',
    customerPhone: '+91 99123 44556',
    loanType: 'Business',
    principalAmount: 75000,
    annualInterestRate: 13,
    tenureMonths: 12,
    monthlyEmi: 7001,
    totalInterest: 9012,
    totalRepayment: 84012,
    paidAmount: 0,
    remainingAmount: 84012,
    applicationDate: '2024-10-20',
    nextDueDate: '2024-11-15',
    status: 'pending',
    purpose: 'Small business inventory expansion',
    createdAt: '2024-10-20T15:00:00.000Z',
    updatedAt: '2024-10-20T15:00:00.000Z',
  },
  {
    id: 'LN004',
    customerId: 'USR-006',
    customerName: 'Anjali Singh',
    customerEmail: 'anjali.singh@example.com',
    customerPhone: '+91 98200 77889',
    loanType: 'Personal',
    principalAmount: 120000,
    annualInterestRate: 11,
    tenureMonths: 14,
    monthlyEmi: 9547,
    totalInterest: 13658,
    totalRepayment: 133658,
    paidAmount: 38188,
    remainingAmount: 95470,
    applicationDate: '2024-07-01',
    approvalDate: '2024-07-03',
    disbursementDate: '2024-07-05',
    nextDueDate: '2024-11-18',
    status: 'active',
    purpose: 'Medical emergency',
    createdAt: '2024-07-01T10:00:00.000Z',
    updatedAt: '2024-10-18T10:00:00.000Z',
  },
  {
    id: 'LN008',
    customerId: 'USR-007',
    customerName: 'Vikram',
    customerEmail: 'vikram@example.com',
    customerPhone: '+91 94480 33221',
    loanType: 'Personal',
    principalAmount: 90000,
    annualInterestRate: 14,
    tenureMonths: 11,
    monthlyEmi: 9347,
    totalInterest: 12817,
    totalRepayment: 102817,
    paidAmount: 28041,
    remainingAmount: 74776,
    applicationDate: '2024-04-12',
    approvalDate: '2024-04-15',
    disbursementDate: '2024-04-20',
    nextDueDate: '2024-10-20',
    status: 'active',
    purpose: 'Electronic appliances purchase',
    createdAt: '2024-04-12T11:00:00.000Z',
    updatedAt: '2024-10-25T11:00:00.000Z',
  },
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'TXN-90214',
    loanId: 'LN123456',
    customerId: 'USR-001',
    customerName: 'Priya Sharma',
    instalmentNumber: 3,
    amount: 9347,
    paymentMethod: 'UPI',
    status: 'Completed',
    paymentDate: '2024-10-10',
    receiptNumber: 'RCP-2024-10-091',
    description: 'EMI Payment - Oct 2024',
  },
  {
    id: 'TXN-87421',
    loanId: 'LN123456',
    customerId: 'USR-001',
    customerName: 'Priya Sharma',
    instalmentNumber: 2,
    amount: 9347,
    paymentMethod: 'Net Banking',
    status: 'Completed',
    paymentDate: '2024-09-10',
    receiptNumber: 'RCP-2024-09-082',
    description: 'EMI Payment - Sep 2024',
  },
  {
    id: 'TXN-76190',
    loanId: 'LN123456',
    customerId: 'USR-001',
    customerName: 'Priya Sharma',
    amount: 200000,
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
    paymentDate: '2024-08-05',
    receiptNumber: 'RCP-DISB-LN123456',
    description: 'Loan Disbursal',
  },
  {
    id: 'TXN-72301',
    loanId: 'LN123456',
    customerId: 'USR-001',
    customerName: 'Priya Sharma',
    instalmentNumber: 1,
    amount: 9347,
    paymentMethod: 'UPI',
    status: 'Completed',
    paymentDate: '2024-08-10',
    receiptNumber: 'RCP-2024-08-011',
    description: 'EMI Payment - Aug 2024',
  },
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [
  {
    id: 'CUST-001',
    userId: 'USR-001',
    fullName: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Green Valley Apts, Indiranagar, Bengaluru, KA - 560038',
    occupation: 'Senior Product Specialist',
    panNumber: 'ABCDE1234F',
    activeLoansCount: 1,
    totalBorrowed: 200000,
    totalRepaid: 60000,
    creditScore: 785,
    status: 'Active',
    createdAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 'CUST-002',
    userId: 'USR-003',
    fullName: 'Ravi Kumar',
    email: 'ravi.kumar@example.com',
    phone: '+91 98450 12345',
    address: 'House #14, Sector 7, HSR Layout, Bengaluru, KA',
    occupation: 'Software Engineer',
    activeLoansCount: 1,
    totalBorrowed: 150000,
    totalRepaid: 56082,
    creditScore: 742,
    status: 'Active',
    createdAt: '2024-02-10T11:00:00.000Z',
  },
  {
    id: 'CUST-003',
    userId: 'USR-004',
    fullName: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    phone: '+91 97310 98765',
    address: 'Plot 89, Jubilee Hills, Hyderabad, TS',
    occupation: 'Consultant',
    activeLoansCount: 1,
    totalBorrowed: 200000,
    totalRepaid: 44660,
    creditScore: 760,
    status: 'Active',
    createdAt: '2024-03-05T09:30:00.000Z',
  },
  {
    id: 'CUST-004',
    userId: 'USR-005',
    fullName: 'Karthik',
    email: 'karthik@example.com',
    phone: '+91 99123 44556',
    address: 'No 34, Gandhi Nagar, Chennai, TN',
    occupation: 'Retail Business Owner',
    activeLoansCount: 0,
    totalBorrowed: 75000,
    totalRepaid: 0,
    creditScore: 690,
    status: 'Pending',
    createdAt: '2024-05-12T14:20:00.000Z',
  },
  {
    id: 'CUST-005',
    userId: 'USR-006',
    fullName: 'Anjali Singh',
    email: 'anjali.singh@example.com',
    phone: '+91 98200 77889',
    address: 'B-1204, Lodha Splendora, Thane, MH',
    occupation: 'Marketing Manager',
    activeLoansCount: 1,
    totalBorrowed: 120000,
    totalRepaid: 38188,
    creditScore: 730,
    status: 'Active',
    createdAt: '2024-06-18T16:45:00.000Z',
  },
  {
    id: 'CUST-006',
    userId: 'USR-007',
    fullName: 'Vikram',
    email: 'vikram@example.com',
    phone: '+91 94480 33221',
    address: 'Flat 12, Royal Palms, Pune, MH',
    occupation: 'Architect',
    activeLoansCount: 1,
    totalBorrowed: 90000,
    totalRepaid: 28041,
    creditScore: 640,
    status: 'Suspended',
    createdAt: '2024-07-22T10:15:00.000Z',
  },
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-1001',
    customerId: 'USR-001',
    customerName: 'Priya Sharma',
    subject: 'Request for provisional interest certificate',
    category: 'Loan Query',
    description: 'Need the provisional interest statement for LN123456 to claim tax deductions under section 24/80C.',
    status: 'Resolved',
    priority: 'Medium',
    createdAt: '2024-09-15T14:00:00.000Z',
  },
  {
    id: 'TCK-1002',
    customerId: 'USR-001',
    customerName: 'Priya Sharma',
    subject: 'Autopay mandate setup query',
    category: 'Payment Issue',
    description: 'Looking to enable auto-debit via NACH/e-mandate for the next instalment on 10 Nov.',
    status: 'In Progress',
    priority: 'Low',
    createdAt: '2024-10-22T11:20:00.000Z',
  },
];

// In-memory / localStorage cache helpers
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn(`Error loading ${key} from localStorage:`, e);
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error saving ${key} to localStorage:`, e);
  }
}

class MockDatabase {
  private users: User[];
  private loans: Loan[];
  private transactions: PaymentTransaction[];
  private customers: CustomerProfile[];
  private tickets: SupportTicket[];
  private schedules: Record<string, EMIScheduleItem[]>;

  constructor() {
    this.users = loadFromStorage('users', INITIAL_USERS);
    this.loans = loadFromStorage('loans', INITIAL_LOANS);
    this.transactions = loadFromStorage('transactions', INITIAL_TRANSACTIONS);
    this.customers = loadFromStorage('customers', INITIAL_CUSTOMERS);
    this.tickets = loadFromStorage('tickets', INITIAL_TICKETS);
    this.schedules = loadFromStorage('schedules', {});

    // Ensure Priya's initial schedule exists
    if (!this.schedules['LN123456']) {
      this.schedules['LN123456'] = generateAmortizationSchedule(
        'LN123456',
        200000,
        12,
        24,
        '2024-08-10',
        3 // 3 paid months (Aug, Sep, Oct)
      );
      this.saveSchedules();
    }
  }

  // Users
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByEmailOrUsername(identifier: string): User | undefined {
    const clean = identifier.trim().toLowerCase();
    return this.users.find(u => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean);
  }

  addUser(user: User): User {
    this.users.push(user);
    saveToStorage('users', this.users);
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates };
      saveToStorage('users', this.users);
      return this.users[idx];
    }
    return undefined;
  }

  // Loans
  getLoans(): Loan[] {
    return this.loans;
  }

  getLoanById(id: string): Loan | undefined {
    return this.loans.find(l => l.id === id);
  }

  getLoansByCustomerId(customerId: string): Loan[] {
    return this.loans.filter(l => l.customerId === customerId);
  }

  addLoan(loan: Loan): Loan {
    this.loans.unshift(loan);
    saveToStorage('loans', this.loans);
    // Auto-generate schedule
    this.schedules[loan.id] = generateAmortizationSchedule(
      loan.id,
      loan.principalAmount,
      loan.annualInterestRate,
      loan.tenureMonths,
      loan.disbursementDate || '2024-11-10',
      0
    );
    this.saveSchedules();
    return loan;
  }

  updateLoan(id: string, updates: Partial<Loan>): Loan | undefined {
    const idx = this.loans.findIndex(l => l.id === id);
    if (idx !== -1) {
      this.loans[idx] = { ...this.loans[idx], ...updates, updatedAt: new Date().toISOString() };
      saveToStorage('loans', this.loans);
      return this.loans[idx];
    }
    return undefined;
  }

  // EMI Schedule
  getScheduleForLoan(loanId: string): EMIScheduleItem[] {
    if (!this.schedules[loanId]) {
      const loan = this.getLoanById(loanId);
      if (loan) {
        this.schedules[loanId] = generateAmortizationSchedule(
          loanId,
          loan.principalAmount,
          loan.annualInterestRate,
          loan.tenureMonths,
          loan.disbursementDate || '2024-11-10',
          loan.paidAmount >= loan.monthlyEmi * 3 ? 3 : 0
        );
        this.saveSchedules();
      } else {
        return [];
      }
    }
    return this.schedules[loanId];
  }

  markScheduleItemPaid(loanId: string, instalmentNumber: number, paymentMethod: string, transactionId: string): EMIScheduleItem | undefined {
    const schedule = this.getScheduleForLoan(loanId);
    const item = schedule.find(s => s.instalmentNumber === instalmentNumber);
    if (item && item.status !== 'paid') {
      item.status = 'paid';
      item.paidAmount = item.monthlyEmi;
      item.paidDate = new Date().toISOString().split('T')[0];
      item.transactionRef = transactionId;
      item.paymentMethod = paymentMethod;
      this.saveSchedules();

      // Update parent loan
      const loan = this.getLoanById(loanId);
      if (loan) {
        const newPaid = loan.paidAmount + item.monthlyEmi;
        const newRemaining = Math.max(0, loan.totalRepayment - newPaid);
        const isComplete = newRemaining <= 0;
        this.updateLoan(loanId, {
          paidAmount: newPaid,
          remainingAmount: newRemaining,
          status: isComplete ? 'completed' : loan.status,
          nextDueDate: this.findNextDueDate(loanId),
        });
      }
      return item;
    }
    return undefined;
  }

  private findNextDueDate(loanId: string): string | undefined {
    const schedule = this.getScheduleForLoan(loanId);
    const nextItem = schedule.find(s => s.status !== 'paid');
    return nextItem?.dueDate;
  }

  private saveSchedules(): void {
    saveToStorage('schedules', this.schedules);
  }

  // Transactions
  getTransactions(): PaymentTransaction[] {
    return this.transactions;
  }

  getTransactionsByCustomerId(customerId: string): PaymentTransaction[] {
    return this.transactions.filter(t => t.customerId === customerId);
  }

  getTransactionsByLoanId(loanId: string): PaymentTransaction[] {
    return this.transactions.filter(t => t.loanId === loanId);
  }

  addTransaction(txn: PaymentTransaction): PaymentTransaction {
    this.transactions.unshift(txn);
    saveToStorage('transactions', this.transactions);
    return txn;
  }

  // Customers
  getCustomers(): CustomerProfile[] {
    return this.customers;
  }

  getCustomerByUserId(userId: string): CustomerProfile | undefined {
    return this.customers.find(c => c.userId === userId);
  }

  getCustomerById(id: string): CustomerProfile | undefined {
    return this.customers.find(c => c.id === id);
  }

  addCustomer(customer: CustomerProfile): CustomerProfile {
    this.customers.push(customer);
    saveToStorage('customers', this.customers);
    return customer;
  }

  updateCustomer(id: string, updates: Partial<CustomerProfile>): CustomerProfile | undefined {
    const idx = this.customers.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.customers[idx] = { ...this.customers[idx], ...updates };
      saveToStorage('customers', this.customers);
      return this.customers[idx];
    }
    return undefined;
  }

  // Support Tickets
  getTickets(): SupportTicket[] {
    return this.tickets;
  }

  getTicketsByCustomerId(customerId: string): SupportTicket[] {
    return this.tickets.filter(t => t.customerId === customerId);
  }

  addTicket(ticket: SupportTicket): SupportTicket {
    this.tickets.unshift(ticket);
    saveToStorage('tickets', this.tickets);
    return ticket;
  }

  // Reset database to initial pristine state
  resetAll(): void {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'users');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'loans');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'transactions');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'customers');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'tickets');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'schedules');
    this.users = [...INITIAL_USERS];
    this.loans = [...INITIAL_LOANS];
    this.transactions = [...INITIAL_TRANSACTIONS];
    this.customers = [...INITIAL_CUSTOMERS];
    this.tickets = [...INITIAL_TICKETS];
    this.schedules = {};
    this.schedules['LN123456'] = generateAmortizationSchedule('LN123456', 200000, 12, 24, '2024-08-10', 3);
  }
}

export const db = new MockDatabase();
