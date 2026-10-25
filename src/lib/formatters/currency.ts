/**
 * Formats a numeric value into standard Indian Currency (INR).
 * Example: 200000 -> ₹ 2,00,000
 * Example: 4850000 -> ₹ 48,50,000
 * Example: 9347 -> ₹ 9,347
 */
export function formatINR(amount: number | undefined | null, showSymbol: boolean = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return showSymbol ? '₹ 0' : '0';
  }

  const rounded = Math.round(amount);
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded).toString();

  let lastThree = absVal.substring(absVal.length - 3);
  const otherNumbers = absVal.substring(0, absVal.length - 3);

  let formatted = '';
  if (otherNumbers !== '') {
    formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  } else {
    formatted = lastThree;
  }

  if (isNegative) {
    formatted = '-' + formatted;
  }

  return showSymbol ? `₹ ${formatted}` : formatted;
}

/**
 * Formats a date string or Date object into "10 Nov 2024" or "10/11/2024" format.
 */
export function formatDate(dateInput: string | Date | undefined, style: 'short' | 'medium' | 'full' = 'medium'): string {
  if (!dateInput) return '—';

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  if (style === 'short') {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
