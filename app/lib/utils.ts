import { MonthlyRevenue } from './definitions';

export const formatCurrency = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

/** Format a YYYY-MM-DD string without timezone shifting. */
export const formatDate = (iso: string, locale = 'en-US') => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

/** "12.5" -> 1250. Works on the decimal string, so no floating-point rounding. */
export const dollarsToCents = (value: string): number => {
  const [whole, frac = ''] = value.trim().split('.');
  return Number(whole) * 100 + Number((frac + '00').slice(0, 2));
};

export const centsToDollars = (cents: number) => (cents / 100).toFixed(2);

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

/** Round the y-axis up to a clean number and return evenly spaced labels. */
export const generateYAxis = (revenue: MonthlyRevenue[]) => {
  const highest = Math.max(0, ...revenue.map((m) => m.revenue / 100));
  const step = highest > 20000 ? 10000 : highest > 5000 ? 2000 : 1000;
  const top = Math.max(step, Math.ceil(highest / step) * step);
  const yAxisLabels: string[] = [];
  for (let i = top; i >= 0; i -= step) yAxisLabels.push(`$${i / 1000}K`);
  return { yAxisLabels, topLabel: top };
};

/** Compact page list with ellipses, e.g. [1, '...', 4, 5, 6, '...', 12]. */
export const generatePagination = (current: number, total: number): (number | '...')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, '...', total - 1, total];
  if (current >= total - 2) return [1, 2, '...', total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
};
