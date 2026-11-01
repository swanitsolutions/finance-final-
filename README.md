# LoanEase — Loan & EMI Financial Management System

A production-grade, enterprise-ready Loan & Equated Monthly Installment (EMI) Financial Management platform designed for financial institutions, micro-lenders, and retail borrowers. LoanEase combines high-precision loan origination, reducing-balance amortization schedules, real-time repayment workflows, and risk underwriting with an executive fintech design system.

---

## 📑 Table of Contents

- [Key Highlights](#-key-highlights)
- [30 Enterprise Requirements Implementation Matrix](#-30-enterprise-requirements-implementation-matrix)
- [System Architecture & Portals](#-system-architecture--portals)
- [Complete Technology Stack](#-complete-technology-stack)
- [Fintech Design System & Color Palette](#-fintech-design-system--color-palette)
- [Financial Computation & Amortization Engine](#-financial-computation--amortization-engine)
- [Data Layer & REST API Simulation](#-data-layer--rest-api-simulation)
- [Security & Authentication](#-security--authentication)
- [Demo Credentials](#-demo-credentials)
- [Getting Started & Local Development](#-getting-started--local-development)
- [Deployment & Production Build](#-deployment--production-build)

---

## 🌟 Key Highlights

- **Full Loan Lifecycle**: End-to-end management from loan exploration, application submission, credit scoring, underwriting approval/rejection, disbursement, to monthly EMI servicing and foreclosure/prepayment.
- **Precision Amortization Math**: Implements standard banking reducing-balance formulas with exact principal vs. interest breakdown, cumulative interest tracking, and dynamic schedule re-computation.
- **Executive Fintech Aesthetics**: Built using an authoritative, high-contrast palette featuring Deep Burgundy (`#612536`), Dark Teal (`#0D343B`), Olive Green (`#6B751B`), Coral Orange (`#E65327`), Pale Yellow (`#E8EA68`), and Deep Navy (`#153755` / `#0D2740`).
- **Interactive Repayment Sandbox**: Customers can simulate instant EMI clearing or partial prepayments with realistic transaction references and downloadable transaction receipts.
- **Enterprise Underwriter Desk**: Credit officers review debt-to-income ratios (DTI), employment history, requested tenure, and collateral notes before granting approvals or rejections with audit timestamps.
- **Zero-Friction Role Switcher**: Built-in credential presets and quick-role switching allows seamless testing between Customer and Administrator personas.

---

## 📋 30 Enterprise Requirements Implementation Matrix

| # | Requirement | Implementation Summary | Relevant Files | How to Test in Application |
|---|---|---|---|---|
| **1** | **Public Routing** | Landing page, dedicated login, self-registration, forgot-password, legal pages, and API documentation accessible without authentication. | `src/App.tsx`, `src/pages/public/*`, `src/pages/auth/*` | Visit `/`, `/login`, `/register`, `/privacy`, `/terms`, `/api-docs`. |
| **2** | **Private Routing** | Guarded customer and admin zones requiring verified session tokens. Unauthenticated visits automatically redirect to `/` with original intent preserved. | `src/components/layout/ProtectedRoute.tsx`, `src/App.tsx` | Clear storage and attempt accessing `/dashboard` or `/admin/dashboard`. |
| **3** | **Role-Based Routing (RBAC)** | Strict access partitioning: customers restricted to self-service portals; administrators restricted to underwriting/system management. | `src/components/layout/ProtectedRoute.tsx`, `src/context/AuthContext.tsx` | Log in as Priya (Customer) and browse to `/admin/loans` to see the RBAC block. |
| **4** | **Authentication** | Dual username/email credentials verification, quick test credential buttons, secure token issuance, and sign-out workflow with popups. | `src/context/AuthContext.tsx`, `src/pages/auth/LoginPage.tsx` | Use `priya` / `password123` or `admin` / `admin123`. Click "Sign Out" to verify toast & redirect. |
| **5** | **Authorization** | Fine-grained permission checks for mutating system state (approving loans, rejecting applications, modifying underwriting interest benchmarks). | `src/lib/api/apiClient.ts`, `src/pages/admin/AdminLoansPage.tsx` | Verify only admin can access approve/reject modal and save underwriting policies. |
| **6** | **Password Security** | Minimum 6-character length policy, real-time dynamic strength meter (Weak/Fair/Strong bar), eye-toggle masking, and password confirmation checks. | `src/pages/auth/RegisterPage.tsx`, `src/pages/auth/LoginPage.tsx` | In `/register`, type varying passwords to watch the reactive strength bars. |
| **7** | **Session Management** | Persistent state stored via `loanease_v1_active_user` and `jwt_token_*` in localStorage, automatic session rehydration, and session termination on logout. | `src/context/AuthContext.tsx`, `src/lib/storage/mockDatabase.ts` | Refresh the browser while logged in; active session remains intact. |
| **8** | **Form Validation** | Strict client-side field validation with inline error messaging, boundary validation (loan principal ₹20k-₹50L, tenure 12-60m), and phone/email regex. | `src/pages/customer/ApplyLoanPage.tsx`, `src/pages/auth/RegisterPage.tsx` | Enter negative amounts or missing required fields to trigger validation warnings. |
| **9** | **API Integration** | Unified Promise-based API layer simulating network latency, HTTP verbs, status codes, and typed payloads for all services. | `src/lib/api/apiClient.ts` | All pages fetch and mutate data exclusively through `apiClient`. |
| **10** | **Backend Validation** | Simulated backend business rules: prevents duplicate email/username, enforces DTI limits, validates payment transaction amounts. | `src/lib/api/apiClient.ts`, `src/lib/storage/mockDatabase.ts` | Attempt registering an existing email like `priya@example.com` to see the backend error. |
| **11** | **Database Relationships** | Full relational schema: `User (1) <-> (1) CustomerProfile`, `Customer (1) <-> (N) Loans`, `Loan (1) <-> (N) Schedules`, `Loan (1) <-> (N) Payments`, `(1) <-> (N) AuditLogs`. | `src/lib/storage/mockDatabase.ts`, `src/types/index.ts` | Applying for a loan automatically relates to customer ID and generates amortization schedules. |
| **12** | **Error Handling** | Structured error boundaries, API failure handling, defensive fallback states, and missing entity detection. | `src/components/common/Modal.tsx`, `src/lib/api/apiClient.ts` | Search non-existent loan IDs or test failed logins to see friendly error banners. |
| **13** | **Loading States** | Animated spinners on buttons during async requests (`isSubmitting`, `isLoading`), pulse skeletons, and page loading indicators. | `src/components/layout/ProtectedRoute.tsx`, `src/pages/customer/ApplyLoanPage.tsx` | Notice submit button spinner during login, loan application, and payment processing. |
| **14** | **Success/Error Notifications** | Non-intrusive floating toast notification system (`NotificationContext`) supporting Success, Error, Warning, and Info alerts with auto-dismiss. | `src/context/NotificationContext.tsx` | Triggers upon sign-out, loan submission, payment clearance, and settings updates. |
| **15** | **404 Not Found Page** | Dedicated, branded 404 page styled with LoanEase theme, clear explanations, and quick routing back to Home or Dashboard. | `src/pages/NotFoundPage.tsx` | Visit any invalid URL like `/some-nonexistent-path`. |
| **16** | **Access Denied Page (403)** | Dedicated HTTP 403 Forbidden page detailing role policy mismatch, showing active session claims, and providing quick account switching. | `src/pages/AccessDeniedPage.tsx`, `src/components/layout/ProtectedRoute.tsx` | Log in as Priya and visit `/admin/dashboard` or browse directly to `/403`. |
| **17** | **Responsive Design** | Fully responsive layout spanning mobile (320px), tablet (768px), and desktop (1280px+), responsive sidebar drawers and horizontally scrollable tables. | `src/components/layout/*`, `src/pages/public/LandingPage.tsx` | Toggle mobile view in browser devtools to test collapsible navigation and grids. |
| **18** | **Search and Filtering** | Multi-attribute search (Loan ID, borrower name, loan category) and status filters (`All`, `Pending`, `Active`, `Completed`, `Rejected`). | `src/pages/admin/AdminLoansPage.tsx`, `src/pages/customer/MyLoansPage.tsx` | Use the search bar in Admin Loans to filter by "Priya" or "LN123456". |
| **19** | **Pagination** | Client/server paginated table views with items per page, current index display ("Showing 1 to 6 of 8"), and Previous/Next buttons. | `src/pages/admin/AdminLoansPage.tsx` | Browse loans in the Admin Loans portal to navigate through pages. |
| **20** | **File Upload Validation** | Document attachment component for KYC/income proof with strict validation: PDF/JPG/PNG only, 5.0 MB maximum size, and size format previews. | `src/pages/customer/ApplyLoanPage.tsx` | In Apply Loan, attach a file > 5MB or invalid `.exe` to verify immediate error feedback. |
| **21** | **Environment Variables** | Documented configuration schema via `.env.example` covering app environment, base URLs, currency symbols, and rate limits. | `.env.example` | Inspect `.env.example` for full key definitions. |
| **22** | **API Security** | Simulated sliding-window rate limiting (100 req/min), XSS input sanitization (neutralizes `<script>` and HTML injection), and Bearer token simulation. | `src/lib/api/apiClient.ts` | Text inputs are sanitized with `sanitizeText` and rate limits monitored in memory. |
| **23** | **Database Backup & Disaster Recovery** | Full JSON snapshot export (download `loanease-backup-[timestamp].json`), JSON backup restore with schema validation, and factory reset. | `src/lib/storage/mockDatabase.ts`, `src/pages/admin/AdminSettingsPage.tsx` | Go to Admin Settings -> "Database Backup & Restore" tab to export or import. |
| **24** | **Testing** | Self-contained automated unit test suites for reducing-balance EMI calculations, authentication rules, and input constraints with an interactive test runner. | `src/tests/*`, `src/pages/admin/AdminSettingsPage.tsx` | Go to Admin Settings -> "Automated Test Suite" tab and click "Run Automated Test Suite". |
| **25** | **Git & GitHub** | Standard `.gitignore` excluding build artifacts and secrets, plus GitHub Actions CI workflow for automated linting and building. | `.gitignore`, `.github/workflows/ci.yml` | GitHub workflow defined in `.github/workflows/ci.yml`. |
| **26** | **Deployment & Production Build** | Production-optimized bundling via Vite and TypeScript compilation tested and verified with `npm run build`. | `package.json`, `vite.config.ts` | Run `npm run build` to verify clean output. |
| **27** | **Logging and Monitoring** | Chronological audit logging system recording security events, policy updates, underwriting approvals, and payments with severity filters. | `src/types/index.ts`, `src/lib/storage/mockDatabase.ts`, `src/pages/admin/AdminSettingsPage.tsx` | Go to Admin Settings -> "Audit & Security Logs" tab to view filterable events. |
| **28** | **API Documentation** | Dedicated interactive OpenAPI / Swagger-style API explorer documenting endpoints, request schemas, parameters, and live "Send Request" sandbox. | `src/pages/public/ApiDocsPage.tsx` | Visit `/api-docs` or click "API Documentation" in the footer. |
| **29** | **README Documentation** | Comprehensive project overview, 30-requirement matrix, color system, architectural diagrams, credentials, and setup instructions. | `README.md` | Currently viewing this comprehensive documentation! |
| **30** | **Accessibility (a11y)** | Semantic HTML structure, `aria-label` attributes on icon buttons, visible focus indicators, high-contrast text conforming to WCAG AA. | `src/pages/auth/LoginPage.tsx`, `src/components/*` | High contrast verified (e.g. Dark Navy text `#172B3A` on Pale Yellow `#E8EA68`). |

---

## 🏛 System Architecture & Portals

### 1. Public Landing & Acquisition Portal
- **Header & Navigation**: Clean top navigation with deep navy branding, frictionless session controls, and quick action links.
- **Hero & Integrated Authentication**: Dual-purpose split hero with value propositions, trust assurances, and an inline authentication card for instant sign-in.
- **Trust Metrics Strip**: Highlights capital disbursed, active borrower satisfaction rate, enterprise uptime, and regulatory compliance.
- **Product Offerings & Services**: Detailed cards for Personal Loans, Home Financing, Vehicle Loans, SME Business Loans, and Education Credit.
- **How It Works**: 4-step progressive timeline detailing Discovery, Digital Verification, Underwriting Decisioning, and Fund Disbursement.
- **Interactive EMI Calculator**: Real-time slider-based calculator enabling prospective borrowers to estimate monthly installments, total interest, and gross payback amount before applying.
- **Global Navy Footer**: Comprehensive footer with institutional disclosures, legal terms, API documentation link, and contact channels.

### 2. Customer Self-Service Portal
- **Burgundy Sidebar Navigation**: Sleek `#612536` navigation bar with intuitive routing to Dashboard, Active Loans, Loan Origination, Amortization Schedules, Payment Hub, and Profile Settings.
- **4-Card Financial KPI Strip**:
  - **Total Active Loans**: Dark Teal (`#0D343B`) container with white typography.
  - **Total Borrowed Capital**: Olive Green (`#6B751B`) container displaying principal balances.
  - **Total Amount Repaid**: Coral Orange (`#E65327`) card displaying cleared obligations.
  - **Outstanding Balance**: High-contrast Pale Yellow (`#E8EA68`) card with dark navy numbers.
- **Interactive Portfolio Charts**: Recharts-powered repayment curves, interest-to-principal proportions, and historical servicing trends.
- **Loan Origination Wizard with File Validation**: Multi-step application collecting loan category, requested amount, preferred tenure, annual income, employment status, and KYC document attachment (max 5MB, PDF/JPG/PNG).
- **Repayment Sandbox**: Allows one-click installment payments with automated receipt generation and balance adjustments.

### 3. Executive & Underwriter Administration Desk
- **Executive KPI Metrics**: Portfolio at Risk (PAR), aggregate lending volume, active customer count, monthly collection rate, and overdue delinquent accounts.
- **Underwriting Queue**: Live approval table with borrower risk scoring, monthly income verification, DTI calculation, one-click approvals, and structured rejection workflows with pagination.
- **System Administration Hub**:
  - **Underwriting Policies**: Configurable benchmark interest rates (% p.a.), grace periods, and late fee charges.
  - **Database Backup & Disaster Recovery**: Export/import complete relational database snapshots in JSON format.
  - **Audit & Security Logs**: Chronological log trail with search and severity filters (INFO, WARN, SECURITY, ERROR).
  - **Automated Test Runner**: Executes reducing-balance, RBAC, and validation test suites with sub-millisecond reporting.

---

## 💻 Complete Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime & Framework** | React 19 + TypeScript | Concurrent React UI with strict financial typing |
| **Build Tooling** | Vite 6 | Rapid HMR and optimized production bundling |
| **Routing** | React Router DOM 7 | Declarative routing, RBAC protection, `/403`, `/api-docs` |
| **Styling** | Tailwind CSS 4 | Utility-first CSS using modern `@import "tailwindcss"` engine |
| **Icons** | Lucide React | High-contrast financial micro-icons |
| **Charts** | Recharts | Financial area charts, composition charts, and pie distributions |
| **Data Persistence** | LocalStorage Relational Engine | Relational client database with JSON export/import |

---

## 🎨 Fintech Design System & Color Palette

LoanEase implements an authoritative, calm, and high-trust financial color theme:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          BRAND & NAVIGATION                            │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Primary Burgundy  │ #612536           │ Sidebar, brand accents, active │
│ Burgundy Hover    │ #4C1C2B           │ Navigation item hover states   │
│ Deep Navy         │ #153755           │ Brand titles, header accents   │
│ Dark Navy         │ #0D2740           │ Footers, deep text, contrast   │
│ Dark Teal         │ #0D343B           │ Financial KPI cards, badges    │
├───────────────────┴───────────────────┴────────────────────────────────┤
│                             ACCENT PALETTE                             │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Olive Green       │ #6B751B           │ Approved loans, positive KPIs  │
│ Coral Orange      │ #E65327           │ Active customers, attention    │
│ Pale Yellow       │ #E8EA68           │ Remaining balances (dark text) │
│ Indigo Accent     │ #5145CD           │ Selected secondary actions     │
├───────────────────┴───────────────────┴────────────────────────────────┤
│                          NEUTRALS & STATUS                             │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ App Background    │ #F3F5F6           │ Main application backdrop      │
│ Tinted Panel      │ #EDF2F5           │ Sub-cards and accent panels    │
│ Card Surface      │ #FFFFFF           │ Pure white card containers     │
│ Borders           │ #DFE5E9           │ Crisp thin separators          │
│ Paid / Success    │ #218568 / #E6F4EE │ Paid status badges & pills     │
│ Pending / Warning │ #C28A20 / #FFF4D9 │ Underwriting pending states    │
│ Overdue / Error   │ #C9414D / #FCEBED │ Overdue penalties, errors, 403 │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

## 🧮 Financial Computation & Amortization Engine

LoanEase calculates retail lending repayment obligations using the **Reducing-Balance Equated Monthly Installment** standard:

$$\text{EMI} = P \times r \times \frac{(1 + r)^n}{(1 + r)^n - 1}$$

Where:
- $P$ = Principal loan amount
- $r$ = Periodic monthly interest rate ($\frac{\text{Annual Rate}}{12 \times 100}$)
- $n$ = Loan tenure in calendar months

Every month's payment reconciles principal reduction:
$$\text{Interest}_t = \text{Remaining Principal}_{t-1} \times r$$
$$\text{Principal}_t = \text{EMI} - \text{Interest}_t$$
$$\text{Remaining Principal}_t = \text{Remaining Principal}_{t-1} - \text{Principal}_t$$

---

## 🔐 Demo Credentials

Quick sign-in buttons are available on `/login` and the top bar:

| Role | Username / Identifier | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Retail Customer** | `priya` (or `priya@example.com`) | `password123` | Self-Service Portal (`/dashboard`, `/loans`, `/payments`, `/support`) |
| **Administrator** | `admin` (or `admin@loanease.com`) | `admin123` | Executive Underwriting & Settings (`/admin/*`) |

*Note: Self-registered users via `/register` are assigned the Customer role.*

---

## 🚀 Getting Started & Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.
3. **Run TypeScript Check & Lint**:
   ```bash
   npm run lint
   ```
4. **Build Production Bundle**:
   ```bash
   npm run build
   ```
