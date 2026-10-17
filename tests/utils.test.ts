import { test } from 'node:test';
import assert from 'node:assert/strict';
import { centsToDollars, dollarsToCents, formatCurrency, formatDate, generatePagination, generateYAxis, initials } from '../app/lib/utils';
import { InvoiceSchema } from '../app/lib/validation';

test('dollarsToCents is exact (no float drift)', () => {
  assert.equal(dollarsToCents('250'), 25000);
  assert.equal(dollarsToCents('250.5'), 25050);
  assert.equal(dollarsToCents('0.29'), 29);
  assert.equal(dollarsToCents('1234.56'), 123456);
});

test('currency and date formatting', () => {
  assert.equal(formatCurrency(123456), '$1,234.56');
  assert.equal(centsToDollars(9950), '99.50');
  assert.equal(formatDate('2026-10-05'), 'Oct 5, 2026');
  assert.equal(initials('Delba de Oliveira'), 'DD');
});

test('pagination list', () => {
  assert.deepEqual(generatePagination(1, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(generatePagination(1, 12), [1, 2, 3, '...', 11, 12]);
  assert.deepEqual(generatePagination(6, 12), [1, '...', 5, 6, 7, '...', 12]);
  assert.deepEqual(generatePagination(12, 12), [1, 2, '...', 10, 11, 12]);
});

test('y-axis covers highest bar and handles empty data', () => {
  const { topLabel } = generateYAxis([{ month: 'Jan', revenue: 450000 }]);
  assert.ok(topLabel >= 4500);
  assert.equal(generateYAxis([]).topLabel, 1000);
});

const valid = { customerId: '8010108f-da3b-4206-9e3d-a1400ccd93ef', amount: '10.50', status: 'paid', date: '2026-10-05' };

test('invoice schema accepts valid input and converts to cents', () => {
  const r = InvoiceSchema.safeParse(valid);
  assert.ok(r.success);
  assert.equal(r.data.amount, 1050);
});

test('invoice schema rejects bad input', () => {
  for (const patch of [{ amount: '0' }, { amount: '-5' }, { amount: '1e3' }, { amount: '12.345' }, { status: 'x' }, { customerId: 'nope' }, { date: '2026-13-40' }]) {
    assert.equal(InvoiceSchema.safeParse({ ...valid, ...patch }).success, false, JSON.stringify(patch));
  }
});
