import { calculateEMI, generateAmortizationSchedule } from '../lib/calculations/emi';

/**
 * Self-contained unit tests for reducing-balance EMI calculations.
 */
export function runEmiTests(): { passed: number; failed: number; results: string[] } {
  const results: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed++;
      results.push(`✓ PASS: ${testName}`);
    } else {
      failed++;
      results.push(`✗ FAIL: ${testName}`);
    }
  }

  // Test 1: Standard reducing balance EMI (₹2,00,000 at 12% p.a. for 24 months)
  // Expected EMI: ~₹9,347
  const test1 = calculateEMI(200000, 12, 24);
  assert(test1.monthlyEmi === 9347, `Standard Loan EMI = ₹9,347 (Calculated: ${test1.monthlyEmi})`);
  assert(test1.totalRepayment === 9347 * 24, `Total Repayment = ${9347 * 24}`);
  assert(test1.totalInterest === test1.totalRepayment - 200000, `Total Interest = ${test1.totalInterest}`);

  // Test 2: Zero Interest Loan (₹1,20,000 at 0% for 12 months)
  // Expected EMI: ₹10,000
  const test2 = calculateEMI(120000, 0, 12);
  assert(test2.monthlyEmi === 10000, `Zero-Interest Loan EMI = ₹10,000 (Calculated: ${test2.monthlyEmi})`);
  assert(test2.totalInterest === 0, `Zero-Interest Total Interest is 0`);

  // Test 3: Edge cases - Negative principal & invalid tenure
  const test3 = calculateEMI(-50000, 12, -5);
  assert(test3.monthlyEmi === 0, `Negative principal handled safely without crash`);

  // Test 4: Amortization schedule reconciliation
  // Ensure the closing balance of the final instalment reaches exactly 0
  const schedule = generateAmortizationSchedule('LN-TEST', 200000, 12, 24, '2024-08-10', 0);
  assert(schedule.length === 24, `Schedule contains exactly 24 monthly items`);
  const finalInstalment = schedule[23];
  assert(finalInstalment.remainingPrincipal === 0, `Closing principal at end of loan is exactly 0`);

  return { passed, failed, results };
}
