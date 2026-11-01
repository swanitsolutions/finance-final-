import { runEmiTests } from './emi.test';
import { runAuthTests } from './auth.test';
import { runValidationTests } from './validation.test';

export interface TestSuiteResult {
  suiteName: string;
  passed: number;
  failed: number;
  results: string[];
}

export interface AllTestsSummary {
  totalPassed: number;
  totalFailed: number;
  durationMs: number;
  suites: TestSuiteResult[];
}

export function runAllSystemTests(): AllTestsSummary {
  const start = performance.now();

  const emiSuite = {
    suiteName: 'Financial Math & Reducing-Balance Amortization',
    ...runEmiTests(),
  };

  const authSuite = {
    suiteName: 'Authentication, Password Security & RBAC',
    ...runAuthTests(),
  };

  const validationSuite = {
    suiteName: 'Input Constraints, File Upload & DTI Calculations',
    ...runValidationTests(),
  };

  const suites = [emiSuite, authSuite, validationSuite];
  const totalPassed = suites.reduce((acc, s) => acc + s.passed, 0);
  const totalFailed = suites.reduce((acc, s) => acc + s.failed, 0);
  const durationMs = Math.round((performance.now() - start) * 10) / 10;

  return {
    totalPassed,
    totalFailed,
    durationMs,
    suites,
  };
}
