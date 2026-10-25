# LoanEase — Complete Loan & EMI Financial Management System

**"Your Dreams, Our Support. Better Loans. Brighter Futures."**

LoanEase is a production-oriented web application for loan origination, reducing-balance EMI calculations, repayment tracking, customer portals, and administrator management.

---

## 1. Quick Demonstration Access

The application includes a pre-seeded, persistent mock adapter adhering strictly to the **Django REST Framework / PostgreSQL** API contracts.

### Fictional Demonstration Accounts:
| Role | Email / Username | Password | Notes |
|------|------------------|----------|-------|
| **Customer** | `priya@example.com` or `priya` | `password123` | Reference customer Priya Sharma (Loan LN123456: ₹2,00,000 @ 12% p.a., EMI ₹9,347) |
| **Administrator** | `admin@loanease.com` or `admin` | `admin123` | Master administrator with customer directory, approval engine, and reports |

*Quick-switch buttons are available in the login form and dashboard sidebars for rapid evaluation.*

---

## 2. Key Architecture & Features

### Public Portal
- Responsive marketing landing page matching Reference Image 1.
- Live interactive reducing-balance EMI calculator with INR currency formatting (`₹ 1,25,000`).
- Quick login card, feature highlights, 4-step process, terms, and privacy pages.

### Customer Portal
- Exact dashboard layout matching Reference Image 1 top right:
  - 4 Key Metrics: Total Loans (1), Total Loan Amount (₹ 2,00,000), Total Paid (₹ 60,000), Remaining Amount (₹ 1,40,000).
  - My Loan Details card (`LN123456`, ₹2,00,000, 12% p.a., 24 months, Monthly EMI ₹9,347, Next Due Date 10 Nov 2024).
  - Repayment progress doughnut chart (30% Paid, 70% Remaining).
  - Recent transactions table and quick actions panel.
- Loan application engine with real-time underwriting estimation.
- Amortization schedule with month-by-month principal and interest components.
- Payment gateway sandbox supporting UPI, Net Banking, and Debit Cards with immediate ledger reconciliation and printable receipts.
- Profile, credit score tracking (785 Prime), and customer support ticket desk.

### Administrator Portal
- Exact dashboard layout matching Reference Image 1 bottom dashboard:
  - 4 Institutional Metrics: Total Customers (125, +5%), Active Loans (98, +8%), Completed Loans (42, +12%), Total Loan Principal (₹ 48,50,000, +7%).
  - Loan Applications bar chart (Approved vs Pending).
  - Loan Status doughnut chart (Active 68%, Completed 25%, Overdue 7%).
  - Recent Customers table (Ravi Kumar, Sneha Reddy, Karthik, Anjali Singh, Vikram).
  - Upcoming EMI payments and Overdue payments tables.
- Underwriting approval engine: Approve or Reject applications (with mandatory audit reason).
- "Add New Loan / Customer" form matching Reference Image 1 bottom right.
- Master EMI schedule management across all loan books.
- Comprehensive financial reports and CSV export.
- Interactive OpenAPI / Swagger inspector modal.

---

## 3. Technology Stack & API Contracts

### Frontend
- **React 19 & TypeScript** with **Vite**.
- **Tailwind CSS v4** with branded palette (`#12365A`, `#5145CD`, `#F4F8FC`, `#159A78`).
- **React Router** with role-based route guards (`ProtectedRoute`).
- **Recharts** for financial data visualizations.
- **Lucide React** for icons.

### Backend Contract (Django 5.x / Django REST Framework)
- `POST /api/v1/auth/register/` — Customer onboarding
- `POST /api/v1/auth/login/` — JWT token generation
- `GET /api/v1/dashboard/customer/` — Scoped customer metrics
- `GET /api/v1/dashboard/admin/` — Institutional portfolio metrics
- `GET /api/v1/loans/` & `POST /api/v1/loans/` — Loan applications
- `POST /api/v1/loans/{id}/approve/` & `reject/` — Administrative decisions
- `GET /api/v1/loans/{id}/schedule/` — Reducing-balance amortization
- `POST /api/v1/payments/initiate/` — Transaction recording

---

## 4. Reducing-Balance EMI Formula

$$\text{EMI} = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$

Where:
- $P$ = Principal amount (INR)
- $r$ = Monthly interest rate ($\text{Annual Rate} / 1200$)
- $n$ = Number of monthly instalments

For $P = ₹2,00,000$, $\text{Rate} = 12\%$, $n = 24$ months:
$$\text{EMI} = ₹9,347$$
Amortization includes final-instalment adjustment ensuring closing principal reaches exactly ₹0.
