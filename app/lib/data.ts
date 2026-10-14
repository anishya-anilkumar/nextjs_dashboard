import 'server-only';
import { sql } from './db';
import { requireUser } from './session';
import { IdSchema } from './validation';
import type {
  CardData,
  CustomerField,
  CustomerRow,
  InvoiceForm,
  InvoicesTableRow,
  MonthlyRevenue,
} from './definitions';

export const ITEMS_PER_PAGE = 8;

/** Escape LIKE wildcards so user input is matched literally. */
const like = (q: string) => `%${q.replace(/[\\%_]/g, '\\$&')}%`;

// SUM() returns bigint, which postgres.js hands back as a string. Cast to
// float8: integer cents stay exact far beyond any realistic total (< 2^53).

export async function fetchCardData(): Promise<CardData> {
  await requireUser();
  const [row] = await sql<
    { collected: number; pending: number; invoice_count: number; customer_count: number }[]
  >`
    SELECT
      COALESCE(SUM(amount) FILTER (WHERE status = 'paid'), 0)::float8    AS collected,
      COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0)::float8 AS pending,
      COUNT(*)::int                                                      AS invoice_count,
      (SELECT COUNT(*) FROM customers)::int                              AS customer_count
    FROM invoices`;
  return {
    collected: row.collected,
    pending: row.pending,
    invoiceCount: row.invoice_count,
    customerCount: row.customer_count,
  };
}

/** Paid revenue for the last 12 calendar months; months without invoices are 0. */
export async function fetchMonthlyRevenue(): Promise<MonthlyRevenue[]> {
  await requireUser();
  return sql<MonthlyRevenue[]>`
    SELECT to_char(m, 'Mon') AS month, COALESCE(SUM(i.amount), 0)::float8 AS revenue
    FROM generate_series(
           date_trunc('month', CURRENT_DATE) - interval '11 months',
           date_trunc('month', CURRENT_DATE),
           interval '1 month') AS m
    LEFT JOIN invoices i
      ON i.status = 'paid' AND date_trunc('month', i.date) = m
    GROUP BY m
    ORDER BY m`;
}

export async function fetchLatestInvoices(): Promise<InvoicesTableRow[]> {
  await requireUser();
  return sql<InvoicesTableRow[]>`
    SELECT i.id, i.customer_id, c.name, c.email, c.image_url, i.amount, i.date::text AS date, i.status
    FROM invoices i JOIN customers c ON c.id = i.customer_id
    ORDER BY i.date DESC, i.created_at DESC
    LIMIT 5`;
}

type InvoiceFilter = { query: string; status?: string };

const statusOf = (s?: string) => (s === 'paid' || s === 'pending' ? s : null);

export async function fetchFilteredInvoices({ query, status }: InvoiceFilter, page: number) {
  await requireUser();
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const pattern = like(query);
  const st = statusOf(status);
  return sql<InvoicesTableRow[]>`
    SELECT i.id, i.customer_id, c.name, c.email, c.image_url, i.amount, i.date::text AS date, i.status
    FROM invoices i JOIN customers c ON c.id = i.customer_id
    WHERE (
        c.name ILIKE ${pattern} OR c.email ILIKE ${pattern}
        OR to_char(i.amount / 100.0, 'FM999999990.00') ILIKE ${pattern}
        OR i.date::text ILIKE ${pattern} OR i.id::text ILIKE ${pattern}
      )
      AND (${st}::text IS NULL OR i.status = ${st})
    ORDER BY i.date DESC, i.created_at DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;
}

export async function fetchInvoicesPages({ query, status }: InvoiceFilter) {
  await requireUser();
  const pattern = like(query);
  const st = statusOf(status);
  const [{ count }] = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM invoices i JOIN customers c ON c.id = i.customer_id
    WHERE (
        c.name ILIKE ${pattern} OR c.email ILIKE ${pattern}
        OR to_char(i.amount / 100.0, 'FM999999990.00') ILIKE ${pattern}
        OR i.date::text ILIKE ${pattern} OR i.id::text ILIKE ${pattern}
      )
      AND (${st}::text IS NULL OR i.status = ${st})`;
  return Math.max(1, Math.ceil(count / ITEMS_PER_PAGE));
}

/** Returns null for malformed ids and for ids that don't exist. */
export async function fetchInvoiceById(id: string): Promise<InvoiceForm | null> {
  await requireUser();
  if (!IdSchema.safeParse(id).success) return null;
  const [invoice] = await sql<InvoiceForm[]>`
    SELECT id, customer_id, amount, status, date::text AS date FROM invoices WHERE id = ${id}`;
  return invoice ?? null;
}

export async function fetchCustomerOptions(): Promise<CustomerField[]> {
  await requireUser();
  return sql<CustomerField[]>`SELECT id, name FROM customers ORDER BY name`;
}

export async function fetchFilteredCustomers(query: string): Promise<CustomerRow[]> {
  await requireUser();
  const pattern = like(query);
  return sql<CustomerRow[]>`
    SELECT c.id, c.name, c.email, c.image_url,
      COUNT(i.id)::int                                                     AS total_invoices,
      COALESCE(SUM(i.amount), 0)::float8                                   AS total_invoiced,
      COALESCE(SUM(i.amount) FILTER (WHERE i.status = 'pending'), 0)::float8 AS outstanding
    FROM customers c LEFT JOIN invoices i ON i.customer_id = c.id
    WHERE c.name ILIKE ${pattern} OR c.email ILIKE ${pattern}
    GROUP BY c.id
    ORDER BY c.name`;
}
