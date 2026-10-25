# LoanEase — Loan & EMI Financial Management System

A production-grade, enterprise-ready Loan & Equated Monthly Installment (EMI) Financial Management platform designed for financial institutions, micro-lenders, and retail borrowers. LoanEase combines high-precision loan origination, reducing-balance amortization schedules, real-time repayment workflows, and risk underwriting with an executive fintech design system.

---

## 📑 Table of Contents

- [Key Highlights](#-key-highlights)
- [System Architecture & Portals](#-system-architecture--portals)
  - [1. Public Landing & Acquisition Portal](#1-public-landing--acquisition-portal)
  - [2. Customer Self-Service Portal](#2-customer-self-service-portal)
  - [3. Executive & Underwriter Administration Desk](#3-executive--underwriter-administration-desk)
- [Complete Technology Stack](#-complete-technology-stack)
- [Fintech Design System & Color Palette](#-fintech-design-system--color-palette)
- [Financial Computation & Amortization Engine](#-financial-computation--amortization-engine)
- [Data Layer & REST API Simulation](#-data-layer--rest-api-simulation)
- [Security & Authentication](#-security--authentication)
- [Project Directory Structure](#-project-directory-structure)
- [Demo Credentials](#-demo-credentials)
- [Getting Started & Local Development](#-getting-started--local-development)
- [Deployment & Production Build](#-deployment--production-build)

---

## 🌟 Key Highlights

- **Full Loan Lifecycle**: End-to-end management from loan exploration, application submission, credit scoring, underwriting approval/rejection, disbursement, to monthly EMI servicing and foreclosure/prepayment.
- **Precision Amortization Math**: Implements standard standard banking reducing-balance formulas with exact principal vs. interest breakdown, cumulative interest tracking, and dynamic schedule re-computation.
- **Executive Fintech Aesthetics**: Built using an authoritative, high-contrast palette featuring Deep Burgundy (`#612536`), Dark Teal (`#0D343B`), Olive Green (`#6B751B`), Coral Orange (`#E65327`), Pale Yellow (`#E8EA68`), and Deep Navy (`#153755` / `#0D2740`).
- **Interactive Repayment Sandbox**: Customers can simulate instant EMI clearing or partial prepayments with realistic transaction references and downloadable transaction receipts.
- **Enterprise Underwriter Desk**: Credit officers review debt-to-income ratios (DTI), employment history, requested tenure, and collateral notes before granting approvals or rejections with audit timestamps.
- **Zero-Friction Role Switcher**: Built-in credential presets and quick-role switching allows seamless testing between Customer, Underwriter, and Auditor personas.

---

## 🏛 System Architecture & Portals

### 1. Public Landing & Acquisition Portal
- **Header & Navigation**: Clean top navigation with deep navy branding, frictionless session controls, and quick action links.
- **Hero & Integrated Authentication**: Dual-purpose split hero with value propositions, trust assurances, and an inline authentication card for instant sign-in.
- **Trust Metrics Strip**: Highlights capital disbursed, active borrower satisfaction rate, enterprise uptime, and regulatory compliance.
- **Product Offerings & Services**: Detailed cards for Personal Loans, Home Financing, Vehicle Loans, SME Business Loans, and Education Credit.
- **How It Works**: 4-step progressive timeline detailing Discovery, Digital Verification, Underwriting Decisioning, and Fund Disbursement.
- **Interactive EMI Calculator**: Real-time slider-based calculator enabling prospective borrowers to estimate monthly installments, total interest, and gross payback amount before applying.
- **Global Navy Footer**: Comprehensive footer with institutional disclosures, security certifications, quick links, and contact channels.

### 2. Customer Self-Service Portal
- **Burgundy Sidebar Navigation**: Sleek `#612536` navigation bar with intuitive routing to Dashboard, Active Loans, Loan Origination, Amortization Schedules, Payment Hub, and Profile Settings.
- **4-Card Financial KPI Strip**:
  - **Total Active Loans**: Dark Teal (`#0D343B`) container with white typography.
  - **Total Borrowed Capital**: Olive Green (`#6B751B`) container displaying principal balances.
  - **Total Amount Repaid**: Coral Orange (`#E65327`) card displaying cleared obligations.
  - **Outstanding Balance**: High-contrast Pale Yellow (`#E8EA68`) card with dark navy numbers.
- **Interactive Portfolio Charts**: Recharts-powered repayment curves, interest-to-principal proportions, and historical servicing trends.
- **Loan Origination Wizard**: Multi-step application collecting loan category, requested amount, preferred tenure, annual income, employment status, and collateral declarations.
- **Repayment Sandbox**: Allows one-click installment payments with automated receipt generation and balance adjustments.

### 3. Executive & Underwriter Administration Desk
- **Executive KPI Metrics**: Portfolio at Risk (PAR), aggregate lending volume, active customer count, monthly collection rate, and overdue delinquent accounts.
- **Underwriting Queue**: Live approval table with borrower risk scoring, monthly income verification, DTI calculation, one-click approvals, and structured rejection workflows.
- **Customer Directory**: Centralized view of all registered borrowers, active loan tallies, credit scores, and verification statuses.
- **Disbursement & Transaction Ledger**: Filterable audit trail of all loan disbursements, installment receipts, penalties, and payment channels.
- **Financial Analytics & Export**: Graphical distribution of loan books across product categories, month-over-month collection velocity, and CSV export functionality.

---

## 💻 Complete Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime & Framework** | React | 19.x | Modern concurrent React UI components & hooks |
| **Language** | TypeScript | 5.8+ | Strict type safety, interface contracts, and financial models |
| **Build Tooling** | Vite | 6.x | Lightning-fast HMR and optimized production bundling |
| **Routing** | React Router DOM | 7.x | Declarative client-side routing, protected routes, and redirects |
| **Styling & Design System** | Tailwind CSS | 4.x | Utility-first CSS using modern `@import "tailwindcss"` engine |
| **Iconography** | Lucide React | Latest | Consistent, lightweight SVG micro-icons |
| **Data Visualizations** | Recharts | 2.15+ | Responsive charts (Pie, Bar, Area, Composed) for financial reporting |
| **Persistence Layer** | LocalStorage / MockDB | Custom | Browser-backed relational database mock mirroring Django REST / PostgreSQL |
| **Typography** | Inter & Monospace | Google Fonts | Crisp numerical clarity with tabular numeral support |

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
│ Olive Green       │ #6B751B           │ Approved loans, positive metrics│
│ Coral Orange      │ #E65327           │ Active customers, attention    │
│ Pale Yellow       │ #E8EA68           │ Cautionary KPIs, remaining debt│
│ Secondary Indigo  │ #5145CD           │ Supplementary actions          │
├───────────────────┴───────────────────┴────────────────────────────────┤
│                          NEUTRALS & SURFACES                           │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Main Background   │ #F3F5F6           │ Global page canvas             │
│ Alt Section Bg    │ #F5F8FA           │ Alternating section backdrops  │
│ Card Surface      │ #FFFFFF           │ Elevated cards, modal dialogs  │
│ Tinted Panel      │ #EDF2F5           │ Sub-panels & form containers   │
│ Fine Border       │ #DFE5E9           │ Crisp hairline dividers        │
├───────────────────┴───────────────────┴────────────────────────────────┤
│                         STATUS BADGE TOKENS                            │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Paid / Success    │ Text: #218568     │ Background: #E6F4EE            │
│ Pending / Review  │ Text: #C28A20     │ Background: #FFF4D9            │
│ Overdue / Reject  │ Text: #C9414D     │ Background: #FCEBED            │
│ Informational     │ Text: #2879B9     │ Background: #E9F2FA            │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

### Typography Hierarchy
- **Landing Display**: `44px – 52px`, Bold (`text-navy-900 font-bold`)
- **Section Headers**: `28px – 34px`, Semibold
- **Dashboard Headers**: `24px – 28px`, Bold
- **KPI Metrics**: `28px – 34px`, Semibold with `tabular-nums`
- **Card Titles & Headers**: `14px – 16px`, Semibold
- **Body & Descriptions**: `14px – 16px`, Regular (`text-[#536473]`)
- **Metadata, Badges & Footers**: `11px – 13px`, Medium

---

## 🧮 Financial Computation & Amortization Engine

LoanEase calculates monthly installments using the standard banking reducing-balance amortization formula:

$$E = P \cdot r \cdot \frac{(1 + r)^n}{(1 + r)^n - 1}$$

Where:
- **$E$**: Equated Monthly Installment (EMI)
- **$P$**: Principal Loan Amount
- **$r$**: Monthly Interest Rate ($\text{Annual Rate} \div 12 \div 100$)
- **$n$**: Loan Tenure in Months

### Monthly Amortization Breakdown Logic
For every month $t$ from $1$ to $n$:
1. **Interest Portion**: $I_t = \text{Remaining Principal}_{t-1} \times r$
2. **Principal Portion**: $P_t = E - I_t$
3. **Closing Principal**: $\text{Remaining Principal}_t = \text{Remaining Principal}_{t-1} - P_t$
4. **Final Month Adjustment**: On month $n$, remaining principal discrepancies due to rounding are calibrated so the ending balance resolves strictly to $0.00.

---

## 🗄 Data Layer & REST API Simulation

The project includes an enterprise-grade client-side database (`src/lib/storage/mockDatabase.ts`) with a standardized asynchronous API client (`src/lib/api/apiClient.ts`):

- **Data Models**:
  - `User`: Accounts, hashed credential tokens, roles (`admin` | `customer`), credit score, contact details.
  - `Loan`: Principal, interest rate, tenure months, purpose, status (`approved` | `pending` | `rejected` | `disbursed` | `closed`), underwriting metadata.
  - `EMISchedule`: Installment index, due date, EMI amount, principal component, interest component, status (`paid` | `pending` | `overdue`).
  - `Payment`: Transaction reference ID, loan linkage, amount paid, payment method (`Bank Transfer` | `Debit Card` | `Auto-Debit` | `UPI`), timestamp.
- **Reactive Storage**: Updates persist across browser reloads via `localStorage`, with an automated seeding routine that initializes realistic enterprise portfolios on initial launch.
- **REST Emulation**: Provides typed asynchronous functions (`apiClient.loans.getAll()`, `apiClient.loans.create()`, `apiClient.emis.pay()`, etc.) that mimic network latency and response envelopes.

---

## 🔒 Security & Authentication

- **Role-Based Protected Routes**: `ProtectedRoute.tsx` enforces authentication state and role access rules:
  - Unauthorized visitors attempting to reach `/customer/*` or `/admin/*` are seamlessly redirected to the landing page (`/`).
  - Customers attempting to view administrative routes are routed to their personal dashboard.
  - Administrators are routed to the Underwriting & Management control deck.
- **Safe Sign-Out Flow**: Logging out terminates session state, clears cached user context, and immediately redirects back to the main landing page (`/`).
- **Input Sanitization**: Client-side validation on email patterns, loan amount limits, and numerical inputs prevents invalid submissions.

---

## 📁 Project Directory Structure

```text
├── index.html                   # HTML entry point with metadata & Inter font
├── metadata.json                # Project identity & app capabilities
├── package.json                 # Project dependencies & npm scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite bundler configuration
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Root application router & providers
│   ├── index.css                # Global Tailwind CSS definitions & custom theme tokens
│   ├── types/
│   │   └── index.ts             # Domain interfaces (User, Loan, EMI, Payment, Stats)
│   ├── context/
│   │   └── AuthContext.tsx      # Auth session provider & role router
│   ├── lib/
│   │   ├── api/
│   │   │   └── apiClient.ts     # Asynchronous API service wrappers
│   │   ├── storage/
│   │   │   └── mockDatabase.ts  # Seeded in-memory & localStorage database
│   │   └── utils/
│   │       └── financialMath.ts # Reducing-balance calculation routines
│   ├── components/
│   │   ├── common/              # Shared UI badges, buttons, cards, KPI components
│   │   └── layout/
│   │       ├── Navbar.tsx       # Public header navigation
│   │       ├── Footer.tsx       # Deep navy global footer
│   │       ├── CustomerLayout.tsx# Customer layout with Burgundy sidebar
│   │       ├── AdminLayout.tsx   # Underwriting layout with Burgundy sidebar
│   │       └── ProtectedRoute.tsx# Role-enforcing router boundary
│   └── pages/
│       ├── public/
│       │   ├── LandingPage.tsx   # Complete public landing page
│       │   └── EMICalculatorPage.tsx # Standalone financial calculation studio
│       ├── customer/
│       │   ├── CustomerDashboard.tsx # Customer KPI metrics & recent activity
│       │   ├── MyLoansPage.tsx       # Active & closed loan listings
│       │   ├── ApplyLoanPage.tsx     # Multi-step loan origination wizard
│       │   ├── AmortizationSchedulePage.tsx # Month-by-month repayment breakdown
│       │   ├── MakePaymentPage.tsx   # Interactive payment clearing sandbox
│       │   └── CustomerProfilePage.tsx # Personal & security profile settings
│       └── admin/
│           ├── AdminDashboard.tsx    # Executive portfolio dashboard
│           ├── LoanApprovalsPage.tsx # Underwriting decision queue
│           ├── CustomerManagementPage.tsx # Centralized customer ledger
│           ├── EMIManagementPage.tsx # Delinquency & schedule oversight
│           ├── TransactionsPage.tsx  # Immutable payment audit log
│           └── ReportsPage.tsx       # Financial reports & data export
```

---

## 👥 Demo Credentials

The platform is pre-loaded with demonstration accounts for instant evaluation:

### 👤 Customer Account
- **Email**: `customer@loanease.com`
- **Password**: `customer123`
- **Permissions**: Browse loans, submit new credit applications, view personal amortization schedules, execute test EMI repayments, and download receipts.

### 🛡️ Administrator & Underwriter Account
- **Email**: `admin@loanease.com`
- **Password**: `admin123`
- **Permissions**: Portfolio analytics, approve/reject credit applications with risk notes, manage global customer directory, track delinquent collections, and export CSV audit reports.

*(A quick-fill switch is also accessible directly inside the authentication modal for frictionless demoing).*

---

## 🚀 Getting Started & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd loanease
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   The application will boot at `http://localhost:3000`.

4. Type-check the codebase:
   ```bash
   npm run lint
   ```

---

## 📦 Deployment & Production Build

To create an optimized production build:

```bash
npm run build
```

This generates a minified, tree-shaken asset bundle in the `dist/` directory, ready to be served by any static hosting platform (Vercel, Netlify, Cloudflare Pages, AWS S3/CloudFront) or backend container (Nginx, Express, Docker).

---

## 📄 License & Compliance

© 2025 LoanEase Financial Technologies Inc. All rights reserved. Built for institutional and commercial lending demonstrations.
