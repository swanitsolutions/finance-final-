import { EMIScheduleItem, PaymentStatus } from '../../types';

export interface EMICalculationResult {
  monthlyEmi: number;
  totalRepayment: number;
  totalInterest: number;
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
}

/**
 * Calculates reducing-balance Equated Monthly Instalment (EMI).
 * Formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 *
 * @param principal Principal loan amount in INR
 * @param annualInterestRate Annual interest rate percentage (e.g., 12 for 12%)
 * @param tenureMonths Loan tenure in months (e.g., 24)
 */
export function calculateEMI(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number
): EMICalculationResult {
  const p = Math.max(0, Number(principal) || 0);
  const rate = Math.max(0, Number(annualInterestRate) || 0);
  const n = Math.max(1, Math.round(Number(tenureMonths) || 1));

  if (p <= 0 || n <= 0) {
    return {
      monthlyEmi: 0,
      totalRepayment: 0,
      totalInterest: 0,
      principal: p,
      annualInterestRate: rate,
      tenureMonths: n,
    };
  }

  // Monthly interest rate
  const r = rate / (12 * 100);

  let monthlyEmi = 0;
  if (r === 0) {
    monthlyEmi = Math.round(p / n);
  } else {
    const factor = Math.pow(1 + r, n);
    monthlyEmi = Math.round((p * r * factor) / (factor - 1));
  }

  const totalRepayment = monthlyEmi * n;
  const totalInterest = Math.max(0, totalRepayment - p);

  return {
    monthlyEmi,
    totalRepayment,
    totalInterest,
    principal: p,
    annualInterestRate: rate,
    tenureMonths: n,
  };
}

/**
 * Generates an accurate month-by-month amortization schedule with closing balance reconciliation.
 */
export function generateAmortizationSchedule(
  loanId: string,
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
  startDateString: string = '2024-08-10',
  paidMonthsCount: number = 0
): EMIScheduleItem[] {
  const result = calculateEMI(principal, annualInterestRate, tenureMonths);
  const r = annualInterestRate / (12 * 100);
  const schedule: EMIScheduleItem[] = [];

  let remainingPrincipal = principal;
  const startDate = new Date(startDateString);

  for (let month = 1; month <= tenureMonths; month++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + (month - 1));
    const dueDateFormatted = dueDate.toISOString().split('T')[0];

    // Interest for current period
    let interestComponent = Math.round(remainingPrincipal * r);
    let principalComponent = result.monthlyEmi - interestComponent;

    // Last month adjustment for exact principal clearance
    if (month === tenureMonths || principalComponent > remainingPrincipal) {
      principalComponent = remainingPrincipal;
      interestComponent = Math.max(0, result.monthlyEmi - principalComponent);
      remainingPrincipal = 0;
    } else {
      remainingPrincipal = Math.max(0, remainingPrincipal - principalComponent);
    }

    const isPaid = month <= paidMonthsCount;
    const status: PaymentStatus = isPaid ? 'paid' : (month === paidMonthsCount + 1 ? 'pending' : 'pending');

    schedule.push({
      id: `${loanId}-EMI-${month.toString().padStart(2, '0')}`,
      loanId,
      instalmentNumber: month,
      dueDate: dueDateFormatted,
      principalComponent,
      interestComponent,
      monthlyEmi: principalComponent + interestComponent,
      paidAmount: isPaid ? principalComponent + interestComponent : 0,
      remainingPrincipal,
      status,
      paidDate: isPaid ? dueDateFormatted : undefined,
      transactionRef: isPaid ? `TXN-EMI-${loanId}-${month}` : undefined,
      paymentMethod: isPaid ? 'UPI' : undefined,
    });
  }

  return schedule;
}
